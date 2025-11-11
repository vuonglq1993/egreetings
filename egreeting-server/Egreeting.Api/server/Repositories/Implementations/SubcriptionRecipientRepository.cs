using System.Linq.Expressions;
using server.Models;
using Microsoft.EntityFrameworkCore;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class SubscriptionRecipientRepository : BaseRepository<SubscriptionRecipient>, ISubscriptionRecipientRepository
    {
        public SubscriptionRecipientRepository(EGreetingDbContext context) : base(context) { }

        public async Task<IEnumerable<SubscriptionRecipient>> GetAllWithSubscriptionAsync()
        {
            return await _dbSet.Include(r => r.Subscription)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<SubscriptionRecipient?> GetByIdWithSubscriptionAsync(int id)
        {
            return await _dbSet.Include(r => r.Subscription)
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id);
        }
    }
}