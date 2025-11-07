using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class SubscriptionService : BaseService<Subscription>, ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;

        public SubscriptionService(ISubscriptionRepository subscriptionRepository)
            : base(subscriptionRepository)
        {
            _subscriptionRepository = subscriptionRepository;
        }

        // ===== Method quan hệ =====
        public async Task<IEnumerable<Subscription>> GetAllWithRelationsAsync()
            => await _subscriptionRepository.GetAllWithRelationsAsync();

        public async Task<Subscription?> GetByIdWithRelationsAsync(int id)
            => await _subscriptionRepository.GetByIdWithRelationsAsync(id);
    }
}