using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class CategoryService : BaseService<Category>, ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
            : base(categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        // Lấy tất cả categories kèm templates
        public async Task<IEnumerable<Category>> GetAllWithTemplatesAsync()
        {
            return await _categoryRepository.GetAllWithTemplatesAsync();
        }

        // Lấy chi tiết 1 category kèm templates
        public async Task<Category?> GetByIdWithTemplatesAsync(int id)
        {
            return await _categoryRepository.GetByIdWithTemplatesAsync(id);
        }
    }
}