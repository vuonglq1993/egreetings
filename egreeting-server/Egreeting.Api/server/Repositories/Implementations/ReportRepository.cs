using server.Models;
using Microsoft.EntityFrameworkCore;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class ReportRepository : BaseRepository<Report>, IReportRepository
    {
        public ReportRepository(EGreetingDbContext context) : base(context) { }

        public async Task<IEnumerable<Report>> GetAllWithRelationsAsync()
        {
            return await _dbSet.AsNoTracking().ToListAsync();
        }

        public async Task<Report?> GetByIdWithRelationsAsync(int id)
        {
            return await _dbSet.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);
        }
    }
}