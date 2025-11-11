using server.Models;

namespace server.Services.Interfaces
{
    public interface ICategoryService : IBaseService<Category>
    {
        Task<IEnumerable<Category>> GetAllWithTemplatesAsync();
        Task<Category?> GetByIdWithTemplatesAsync(int id);
    }
}