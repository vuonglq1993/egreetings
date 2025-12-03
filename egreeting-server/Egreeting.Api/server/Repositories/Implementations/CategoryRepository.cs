using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;
using server.DTOs;

namespace server.Repositories.Implementations
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(EGreetingDbContext context) : base(context) { }

        public async Task<IEnumerable<Category>> GetAllWithTemplatesAsync()
        {
            return await _dbSet
                .Include(c => c.Templates)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Category?> GetByIdWithTemplatesAsync(int id)
        {
            return await _dbSet
                .Include(c => c.Templates)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllWithTemplateCountAsync()
        {
            return await _dbSet
                .Select(c => new CategoryDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    TemplateCount = c.Templates.Count()
                })
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<CategoryDTO?> GetByIdWithTemplateCountAsync(int id)
        {
            return await _dbSet
                .Where(c => c.Id == id)
                .Select(c => new CategoryDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    TemplateCount = c.Templates.Count()
                })
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }
    }
}