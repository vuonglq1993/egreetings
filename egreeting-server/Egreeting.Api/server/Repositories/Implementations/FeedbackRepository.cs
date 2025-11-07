using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class FeedbackRepository : BaseRepository<Feedback>, IFeedbackRepository
    {
        public FeedbackRepository(EGreetingDbContext context) : base(context) { }

        public async Task<IEnumerable<Feedback>> GetAllWithUserAsync()
        {
            return await _dbSet
                .Include(f => f.User)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Feedback?> GetByIdWithUserAsync(int id)
        {
            return await _dbSet
                .Include(f => f.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.Id == id);
        }
    }
}