using server.Models;
using server.DTOs;

namespace server.Services.Interfaces
{
    public interface ICategoryService : IBaseService<Category>
    {
        Task<IEnumerable<Category>> GetAllWithTemplatesAsync();
        Task<Category?> GetByIdWithTemplatesAsync(int id);

        Task<IEnumerable<CategoryDTO>> GetAllWithTemplateCountAsync();
        Task<CategoryDTO?> GetByIdWithTemplateCountAsync(int id);
    }
}