using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class SubscriptionRecipientService : BaseService<SubscriptionRecipient>, ISubscriptionRecipientService
    {
        private readonly ISubscriptionRecipientRepository _subscriptionRecipientRepository;

        public SubscriptionRecipientService(ISubscriptionRecipientRepository subscriptionRecipientRepository)
            : base(subscriptionRecipientRepository)
        {
            _subscriptionRecipientRepository = subscriptionRecipientRepository;
        }

        // Các hàm đặc thù, ví dụ lấy dữ liệu có join Subscription
        public async Task<IEnumerable<SubscriptionRecipient>> GetAllWithSubscriptionAsync()
        {
            return await _subscriptionRecipientRepository.GetAllWithSubscriptionAsync();
        }

        public async Task<SubscriptionRecipient?> GetByIdWithSubscriptionAsync(int id)
        {
            return await _subscriptionRecipientRepository.GetByIdWithSubscriptionAsync(id);
        }
    }
}