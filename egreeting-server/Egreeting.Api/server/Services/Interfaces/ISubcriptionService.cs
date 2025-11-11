using server.Models;

namespace server.Services.Interfaces
{
    public interface ISubscriptionService : IBaseService<Subscription>
    {
        Task<IEnumerable<Subscription>> GetAllWithRelationsAsync();
        Task<Subscription?> GetByIdWithRelationsAsync(int id);
    }
}