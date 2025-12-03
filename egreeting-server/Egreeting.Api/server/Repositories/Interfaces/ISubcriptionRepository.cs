using server.Models;

namespace server.Repositories.Interfaces
{
    public interface ISubscriptionRepository : IBaseRepository<Subscription>
    {
        Task<IEnumerable<Subscription>> GetAllWithRelationsAsync();
        Task<Subscription?> GetByIdWithRelationsAsync(int id);
        
    }
}
