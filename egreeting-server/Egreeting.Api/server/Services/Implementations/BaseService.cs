using System.Linq.Expressions;
using server.Repositories;

namespace server.Services
{
    public class BaseService<T> where T : class
    {
        private readonly BaseRepository<T> _repository;

        public BaseService(BaseRepository<T> repository)
        {
            _repository = repository;
        }

        // ===== CRUD =====
        public virtual Task<IEnumerable<T>> GetAllAsync() => _repository.GetAllAsync();
        public virtual Task<T?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);
        public virtual Task AddAsync(T entity) => _repository.AddAsync(entity);
        public virtual Task<bool> UpdateAsync(T entity) => _repository.UpdateAsync(entity);
        public virtual Task<bool> DeleteAsync(int id) => _repository.DeleteAsync(id);

        // ===== Count =====
        public virtual Task<int> CountAsync() => _repository.CountAsync();

        // ===== Filter =====
        public virtual Task<IEnumerable<T>> FilterAsync(
            Expression<Func<T, bool>>? predicate = null,
            string? sortField = null,
            string? sortOrder = "asc",
            int pageNumber = 1,
            int pageSize = 10)
            => _repository.FilterAsync(predicate, sortField, sortOrder, pageNumber, pageSize);

        // ===== Search =====
        public virtual Task<IEnumerable<T>> SearchAsync(
            string keyword,
            params Expression<Func<T, string>>[] fields)
            => _repository.SearchAsync(keyword, fields);
    }
}