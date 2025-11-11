using server.Models;

namespace server.Repositories.Interfaces
{
    public interface ITemplateRepository : IBaseRepository<Template>
    {
        Task<IEnumerable<Template>> GetAllWithCategoryAsync();
        Task<Template?> GetByIdWithCategoryAsync(int id);
    }
}