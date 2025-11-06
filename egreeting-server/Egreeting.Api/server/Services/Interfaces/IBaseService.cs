using System.Linq.Expressions;

namespace server.Services.Interfaces
{
    public interface IBaseService<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task<T> CreateAsync(T entity);
        Task<bool> UpdateAsync(int id, T entity);
        Task<bool> DeleteAsync(int id);

        // Advanced filter
        Task<(IEnumerable<T> Data, int Total)> FilterAsync(
            string? search = null,
            string? sortBy = null,
            bool desc = false,
            int page = 1,
            int pageSize = 20
        );
    }
}