using System.Linq.Expressions;

namespace server.Services
{
    public interface IBaseService<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task<T> CreateAsync(T entity);
        Task UpdateAsync(int id, T entity);
        Task DeleteAsync(int id);
        Task<IEnumerable<T>> SearchAsync(string keyword, params Expression<Func<T, string>>[] searchFields);
        Task<(IEnumerable<T> Items, int TotalCount)> SearchAsync(
            string? search = null,
            string? sortBy = null,
            bool isDescending = false,
            int pageNumber = 1,
            int pageSize = 10,
            Expression<Func<T, bool>>? filter = null);
    }
}