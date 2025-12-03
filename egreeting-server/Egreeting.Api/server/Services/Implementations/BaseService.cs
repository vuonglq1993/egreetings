using System.Linq.Expressions;
using System.Reflection;
using System.Linq.Dynamic.Core;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class BaseService<T> : IBaseService<T> where T : class
    {
        protected readonly IBaseRepository<T> _repository;

        public BaseService(IBaseRepository<T> repository)
        {
            _repository = repository;
        }

        // ===== Basic CRUD =====
        public virtual Task<IEnumerable<T>> GetAllAsync() => _repository.GetAllAsync();

        public virtual Task<T?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);

        public virtual Task<T> CreateAsync(T entity) => _repository.AddAsync(entity);

        public virtual async Task UpdateAsync(int id, T entity)
        {
            var idProp = typeof(T).GetProperty("Id", BindingFlags.Public | BindingFlags.Instance);
            if (idProp != null)
                idProp.SetValue(entity, id);

            await _repository.UpdateAsync(entity);
        }

        public virtual Task DeleteAsync(int id) => _repository.DeleteAsync(id);

        // ===== Simple keyword search (Dynamic LINQ) =====
        public virtual async Task<IEnumerable<T>> SearchAsync(
            string keyword,
            params Expression<Func<T, string>>[] searchFields)
        {
            var all = await _repository.GetAllAsync();

            if (string.IsNullOrWhiteSpace(keyword) || searchFields.Length == 0)
                return all;

            var orConditions = string.Join(" OR ", searchFields.Select(f =>
            {
                if (f.Body is MemberExpression memberExpr)
                    return $"{memberExpr.Member.Name}.Contains(@0)";
                throw new InvalidOperationException("Invalid expression");
            }));

            var queryable = all.AsQueryable().Where(orConditions, keyword);
            return queryable.ToList();
        }

        // ===== Advanced Search + Pagination =====
        public virtual async Task<(IEnumerable<T> Items, int TotalCount)> SearchAsync(
            string? search = null,
            string? sortBy = null,
            bool isDescending = false,
            int pageNumber = 1,
            int pageSize = 10,
            Expression<Func<T, bool>>? filter = null)
        {
            var query = (await _repository.GetAllAsync(filter)).AsQueryable();

            // 🔍 Search across all string fields
            if (!string.IsNullOrEmpty(search))
            {
                var stringProps = typeof(T).GetProperties()
                    .Where(p => p.PropertyType == typeof(string))
                    .Select(p => p.Name)
                    .ToArray();

                if (stringProps.Any())
                {
                    var whereClause = string.Join(" OR ", stringProps.Select(p => $"{p}.Contains(@0)"));
                    query = query.Where(whereClause, search);
                }
            }

            // 🔃 Sorting
            if (!string.IsNullOrEmpty(sortBy) && typeof(T).GetProperty(sortBy) != null)
            {
                var order = isDescending ? "descending" : "ascending";
                query = query.OrderBy($"{sortBy} {order}");
            }

            var total = query.Count();

            // 🔢 Paging
            var items = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

            return (items, total);
        }
    }
}
