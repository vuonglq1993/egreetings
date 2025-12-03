using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;
using server.DTOs;
using System.Linq.Expressions;

namespace server.Services.Implementations
{
    public class CategoryService : BaseService<Category>, ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository) : base(repository)
        {
            _repository = repository;
        }

        // ===== Implement DTO methods =====
        public async Task<IEnumerable<CategoryDTO>> GetAllWithTemplateCountAsync()
        {
            var categories = await _repository.GetAllWithTemplatesAsync();
            return categories.Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                TemplateCount = c.Templates.Count
            });
        }

        public async Task<CategoryDTO?> GetByIdWithTemplateCountAsync(int id)
        {
            var category = await _repository.GetByIdWithTemplatesAsync(id);
            if (category == null) return null;

            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                TemplateCount = category.Templates.Count
            };
        }

        public async Task<IEnumerable<Category>> GetAllWithTemplatesAsync()
            => await _repository.GetAllWithTemplatesAsync();

        public async Task<Category?> GetByIdWithTemplatesAsync(int id)
            => await _repository.GetByIdWithTemplatesAsync(id);

        // ===== Implement IBaseService<Category> methods =====
        public async Task<Category> CreateAsync(Category entity)
            => await _repository.AddAsync(entity);

        public async Task UpdateAsync(int id, Category entity)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) throw new KeyNotFoundException("Category not found");

            existing.Name = entity.Name;
            existing.Description = entity.Description;

            await _repository.UpdateAsync(existing);
        }

        public async Task<IEnumerable<Category>> SearchAsync(string keyword, params Expression<Func<Category, string>>[] fields)
            => await base.SearchAsync(keyword, fields);

        public async Task<(IEnumerable<Category> Items, int TotalCount)> SearchAsync(
            string? search, string? sortBy, bool isDescending, int page, int pageSize,
            Expression<Func<Category, bool>>? filter = null)
            => await base.SearchAsync(search, sortBy, isDescending, page, pageSize, filter);
    }
}
