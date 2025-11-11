using server.Models;

namespace server.Repositories.Interfaces
{
    public interface ISubscriptionRecipientRepository : IBaseRepository<SubscriptionRecipient>
    {
        Task<IEnumerable<SubscriptionRecipient>> GetAllWithSubscriptionAsync();
        Task<SubscriptionRecipient?> GetByIdWithSubscriptionAsync(int id);
    }
}