using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;
using System.Linq.Expressions;

namespace server.Repositories.Implementations
{
    public class SubscriptionRecipientRepository : BaseRepository<SubscriptionRecipient>, ISubscriptionRecipientRepository
    {
        public SubscriptionRecipientRepository(EGreetingDbContext context) : base(context) { }

        public async Task<IEnumerable<SubscriptionRecipient>> GetAllWithRelationsAsync(
            Expression<Func<SubscriptionRecipient, bool>>? filter = null,
            Func<IQueryable<SubscriptionRecipient>, IOrderedQueryable<SubscriptionRecipient>>? orderBy = null)
        {
            IQueryable<SubscriptionRecipient> query = _dbSet
                .Include(sr => sr.Subscription);

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null)
                query = orderBy(query);

            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<SubscriptionRecipient?> GetByIdWithRelationsAsync(int id)
        {
            return await _dbSet
                .Include(sr => sr.Subscription)
                .AsNoTracking()
                .FirstOrDefaultAsync(sr => sr.Id == id);
        }
    }
}