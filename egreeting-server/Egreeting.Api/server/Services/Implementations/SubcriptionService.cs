using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class SubscriptionService : BaseService<Subscription>, ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;

        public SubscriptionService(ISubscriptionRepository subscriptionRepository) : base(subscriptionRepository)
        {
            _subscriptionRepository = subscriptionRepository;
        }

        // Lấy tất cả subscription kèm quan hệ
        public async Task<IEnumerable<Subscription>> GetAllWithRelationsAsync()
            => await _subscriptionRepository.GetAllWithRelationsAsync();

        // Lấy subscription theo id kèm quan hệ
        public async Task<Subscription?> GetByIdWithRelationsAsync(int id)
            => await _subscriptionRepository.GetByIdWithRelationsAsync(id);
    }
}