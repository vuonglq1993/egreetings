using server.Models;
using System.Linq.Expressions;

namespace server.Repositories.Interfaces
{
    public interface ITemplateRepository : IBaseRepository<Template>
    {
        Task<IEnumerable<Template>> GetAllWithRelationsAsync(
            Expression<Func<Template, bool>>? filter = null,
            Func<IQueryable<Template>, IOrderedQueryable<Template>>? orderBy = null);

        Task<Template?> GetByIdWithRelationsAsync(int id);
        Task<(IEnumerable<Template> items, int totalCount)> SearchWithRelationsAsync(
            string? search,
            string? sortBy,
            bool isDescending,
            int pageNumber,
            int pageSize);

    }
}