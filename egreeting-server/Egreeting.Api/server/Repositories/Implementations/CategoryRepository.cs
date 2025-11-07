using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;

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
    }
}