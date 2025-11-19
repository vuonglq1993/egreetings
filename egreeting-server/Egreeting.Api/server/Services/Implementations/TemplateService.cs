using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class TemplateService : BaseService<Template>, ITemplateService
    {
        private readonly ITemplateRepository _repository;

        public TemplateService(ITemplateRepository repository) : base(repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Template>> GetAllWithRelationsAsync()
            => await _repository.GetAllWithRelationsAsync();

        public async Task<Template?> GetByIdWithRelationsAsync(int id)
            => await _repository.GetByIdWithRelationsAsync(id);

        public async Task<(IEnumerable<Template> items, int totalCount)> SearchWithRelationsAsync(
            string? search,
            string? sortBy,
            bool isDescending,
            int pageNumber,
            int pageSize)
            => await _repository.SearchWithRelationsAsync(search, sortBy, isDescending, pageNumber, pageSize);
    }
}