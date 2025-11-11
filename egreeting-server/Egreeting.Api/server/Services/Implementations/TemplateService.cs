using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class TemplateService : BaseService<Template>, ITemplateService
    {
        private readonly ITemplateRepository _templateRepository;

        public TemplateService(ITemplateRepository templateRepository)
            : base(templateRepository)
        {
            _templateRepository = templateRepository;
        }

        // ===== Methods with relations =====
        public async Task<IEnumerable<Template>> GetAllWithCategoryAsync()
            => await _templateRepository.GetAllWithCategoryAsync();

        public async Task<Template?> GetByIdWithCategoryAsync(int id)
            => await _templateRepository.GetByIdWithCategoryAsync(id);
    }
}