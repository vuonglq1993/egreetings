using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class SubscriptionRepository : BaseRepository<Subscription>, ISubscriptionRepository
    {
        private readonly EGreetingDbContext _db;

        public SubscriptionRepository(EGreetingDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Subscription>> GetAllWithRelationsAsync()
        {
            return await _db.Subscriptions
                .Include(s => s.Package)
                .ToListAsync();
        }

        public async Task<Subscription?> GetByIdWithRelationsAsync(int id)
        {
            return await _db.Subscriptions
                .Include(s => s.Package)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Subscription?> GetActiveSubscriptionForUserAsync(int userId)
        {
            return await _db.Subscriptions
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.EndDate)
                .FirstOrDefaultAsync(s => s.EndDate >= DateOnly.FromDateTime(DateTime.Now));
        }

        // NEW: get all subscriptions
        public async Task<List<Subscription>> GetAllSubscriptionsForUserAsync(int userId)
        {
            return await _db.Subscriptions
                .Where(s => s.UserId == userId)
                .Include(s => s.Package)
                .ToListAsync();
        }
    }
}
