using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class SubscriptionRecipientService : BaseService<SubscriptionRecipient>, ISubscriptionRecipientService
    {
        private readonly ISubscriptionRecipientRepository _repository;

        public SubscriptionRecipientService(ISubscriptionRecipientRepository repository) : base(repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<SubscriptionRecipient>> GetAllWithRelationsAsync()
            => await _repository.GetAllWithRelationsAsync();

        public async Task<SubscriptionRecipient?> GetByIdWithRelationsAsync(int id)
            => await _repository.GetByIdWithRelationsAsync(id);
    }
}