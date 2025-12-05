using server.Models;
using server.DTOs;

namespace server.Services.Interfaces
{
    public interface ISubscriptionService : IBaseService<Subscription>
    {
        Task<IEnumerable<Subscription>> GetAllWithRelationsAsync();
        Task<Subscription?> GetByIdWithRelationsAsync(int id);
        Task<Subscription?> GetActiveSubscriptionForUserAsync(int userId);
        Task<SubscriptionSummaryDto?> GetUserSubscriptionSummaryAsync(int userId);
    }
}