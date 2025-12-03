using server.Models;

namespace server.Repositories.Interfaces
{
    public interface ICategoryRepository : IBaseRepository<Category>
    {
        Task<IEnumerable<Category>> GetAllWithTemplatesAsync();
        Task<Category?> GetByIdWithTemplatesAsync(int id);
    }
}