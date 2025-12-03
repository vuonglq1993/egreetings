using server.Models;
using System.Linq.Expressions;

namespace server.Repositories.Interfaces
{
    public interface ISubscriptionRecipientRepository : IBaseRepository<SubscriptionRecipient>
    {
        Task<IEnumerable<SubscriptionRecipient>> GetAllWithRelationsAsync(
            Expression<Func<SubscriptionRecipient, bool>>? filter = null,
            Func<IQueryable<SubscriptionRecipient>, IOrderedQueryable<SubscriptionRecipient>>? orderBy = null);

        Task<SubscriptionRecipient?> GetByIdWithRelationsAsync(int id);
    }
}