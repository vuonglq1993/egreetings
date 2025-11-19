using server.Models;
using System.Collections.Generic;

namespace server.Services.Interfaces
{
    public interface ITemplateService : IBaseService<Template>
    {
        Task<IEnumerable<Template>> GetAllWithRelationsAsync();
        Task<Template?> GetByIdWithRelationsAsync(int id);
        // ITemplateService.cs
        Task<(IEnumerable<Template> items, int totalCount)> SearchWithRelationsAsync(
            string? search,
            string? sortBy,
            bool isDescending,
            int pageNumber,
            int pageSize);
    }
}