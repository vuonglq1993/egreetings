using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using server.Models;

namespace server.Repositories
{
    public class BaseRepository<T> where T : class
    {
        protected readonly EGreetingDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public BaseRepository(EGreetingDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        // ===== Basic CRUD =====
        public virtual async Task<IEnumerable<T>> GetAllAsync()
            => await _dbSet.AsNoTracking().ToListAsync();

        public virtual async Task<T?> GetByIdAsync(int id)
            => await _dbSet.FindAsync(id);

        public virtual async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task<bool> UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            return await _context.SaveChangesAsync() > 0;
        }

        public virtual async Task<bool> DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null) return false;

            _dbSet.Remove(entity);
            return await _context.SaveChangesAsync() > 0;
        }

        // ===== Count =====
        public virtual async Task<int> CountAsync()
            => await _dbSet.CountAsync();

        // ===== Filter with paging & sorting =====
        public virtual async Task<IEnumerable<T>> FilterAsync(
            Expression<Func<T, bool>>? predicate = null,
            string? sortField = null,
            string? sortOrder = "asc",
            int pageNumber = 1,
            int pageSize = 10)
        {
            IQueryable<T> query = _dbSet.AsNoTracking();

            if (predicate != null)
                query = query.Where(predicate);

            // Sorting
            if (!string.IsNullOrWhiteSpace(sortField))
            {
                query = sortOrder?.ToLower() == "desc"
                    ? query.OrderByDescending(e => EF.Property<object>(e, sortField))
                    : query.OrderBy(e => EF.Property<object>(e, sortField));
            }

            // Paging
            query = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);

            return await query.ToListAsync();
        }

        // ===== Keyword Search =====
        public virtual async Task<IEnumerable<T>> SearchAsync(
            string keyword,
            params Expression<Func<T, string>>[] fields)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return await GetAllAsync();

            IQueryable<T> query = _dbSet.AsNoTracking();
            Expression<Func<T, bool>>? filter = null;

            foreach (var field in fields)
            {
                var body = Expression.Call(
                    field.Body,
                    typeof(string).GetMethod("Contains", new[] { typeof(string) })!,
                    Expression.Constant(keyword, typeof(string))
                );

                var condition = Expression.Lambda<Func<T, bool>>(body, field.Parameters);

                filter = filter == null ? condition : CombineOr(filter, condition);
            }

            return await query.Where(filter!).ToListAsync();
        }

        private static Expression<Func<T, bool>> CombineOr(Expression<Func<T, bool>> expr1, Expression<Func<T, bool>> expr2)
        {
            var parameter = Expression.Parameter(typeof(T));
            var body = Expression.OrElse(
                Expression.Invoke(expr1, parameter),
                Expression.Invoke(expr2, parameter)
            );
            return Expression.Lambda<Func<T, bool>>(body, parameter);
        }
    }
}
