using Microsoft.EntityFrameworkCore;
using server.Services.Interfaces;
using System.Linq.Expressions;

namespace server.Services.Implementations
{
    public class BaseService<T> : IBaseService<T> where T : class
    {
        private readonly DbContext _context;
        private readonly DbSet<T> _dbSet;

        public BaseService(DbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        // ==============================
        // ===== BASIC CRUD METHODS =====
        // ==============================

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.AsNoTracking().ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<T> CreateAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> UpdateAsync(int id, T entity)
        {
            var existing = await _dbSet.FindAsync(id);
            if (existing == null) return false;

            _context.Entry(existing).CurrentValues.SetValues(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _dbSet.FindAsync(id);
            if (existing == null) return false;

            _dbSet.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        // ==============================
        // ====== ADVANCED FILTER =======
        // ==============================

        public async Task<(IEnumerable<T> Data, int Total)> FilterAsync(
            string? search = null,
            string? sortBy = null,
            bool desc = false,
            int page = 1,
            int pageSize = 20)
        {
            IQueryable<T> query = _dbSet.AsQueryable();

            // Search by string fields
            if (!string.IsNullOrEmpty(search))
            {
                var parameter = Expression.Parameter(typeof(T), "x");
                var stringProps = typeof(T).GetProperties()
                    .Where(p => p.PropertyType == typeof(string))
                    .ToList();

                Expression? filterExpression = null;

                foreach (var prop in stringProps)
                {
                    var propAccess = Expression.Property(parameter, prop);
                    var searchConst = Expression.Constant(search);
                    var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) })!;
                    var containsExpr = Expression.Call(propAccess, containsMethod, searchConst);

                    filterExpression = filterExpression == null
                        ? (Expression)containsExpr
                        : Expression.OrElse(filterExpression, containsExpr);
                }

                if (filterExpression != null)
                {
                    var lambda = Expression.Lambda<Func<T, bool>>(filterExpression, parameter);
                    query = query.Where(lambda);
                }
            }

            // Sorting
            if (!string.IsNullOrEmpty(sortBy))
            {
                var property = typeof(T).GetProperty(sortBy,
                    System.Reflection.BindingFlags.IgnoreCase |
                    System.Reflection.BindingFlags.Public |
                    System.Reflection.BindingFlags.Instance);

                if (property != null)
                {
                    var parameter = Expression.Parameter(typeof(T), "x");
                    var propertyAccess = Expression.Property(parameter, property);
                    var orderByExpr = Expression.Lambda(propertyAccess, parameter);

                    string methodName = desc ? "OrderByDescending" : "OrderBy";
                    var resultExpr = Expression.Call(typeof(Queryable), methodName,
                        new Type[] { typeof(T), property.PropertyType },
                        query.Expression, Expression.Quote(orderByExpr));

                    query = query.Provider.CreateQuery<T>(resultExpr);
                }
            }

            var total = await query.CountAsync();
            var data = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return (data, total);
        }
    }
}
