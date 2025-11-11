using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class TemplateRepository : BaseRepository<Template>, ITemplateRepository
    {
        public TemplateRepository(EGreetingDbContext context) : base(context) { }

        // ===== Methods with relations =====
        public async Task<IEnumerable<Template>> GetAllWithCategoryAsync()
        {
            return await _dbSet
                .Include(t => t.Category)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Template?> GetByIdWithCategoryAsync(int id)
        {
            return await _dbSet
                .Include(t => t.Category)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }
    }
}