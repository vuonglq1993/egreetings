using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class SubscriptionRepository : BaseRepository<Subscription>, ISubscriptionRepository
    {
        public SubscriptionRepository(EGreetingDbContext context) : base(context) { }

        public async Task<IEnumerable<Subscription>> GetAllWithRelationsAsync()
        {
            return await _dbSet
                .Include(s => s.User)
                .Include(s => s.Package)
                .Include(s => s.SubscriptionRecipients)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Subscription?> GetByIdWithRelationsAsync(int id)
        {
            return await _dbSet
                .Include(s => s.User)
                .Include(s => s.Package)
                .Include(s => s.SubscriptionRecipients)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Subscription?> GetActiveSubscriptionForUserAsync(int userId)
        {
            return await _dbSet
                .Include(s => s.User)
                .Include(s => s.Package)
                .Include(s => s.SubscriptionRecipients)
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.StartDate)
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }
    }
}
