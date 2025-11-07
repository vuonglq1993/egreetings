using System.Linq.Expressions;

namespace server.Repositories
{
    public interface IBaseRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync(
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            string? includeProperties = null
        );

        Task<T?> GetByIdAsync(int id, string? includeProperties = null);

        Task<T> AddAsync(T entity);

        Task UpdateAsync(T entity);

        Task DeleteAsync(int id);

        Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
    }
}