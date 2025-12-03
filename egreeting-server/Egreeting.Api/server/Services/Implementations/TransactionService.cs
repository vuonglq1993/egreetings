using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class TransactionService : BaseService<Transaction>, ITransactionService
    {
        private readonly ITransactionRepository _repository;

        public TransactionService(ITransactionRepository repository) : base(repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Transaction>> GetAllWithRelationsAsync()
            => await _repository.GetAllWithRelationsAsync();

        public async Task<Transaction?> GetByIdWithRelationsAsync(int id)
            => await _repository.GetByIdWithRelationsAsync(id);
    }
}