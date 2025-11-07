using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class TransactionService : BaseService<Transaction>, ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;

        public TransactionService(ITransactionRepository transactionRepository)
            : base(transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        // ===== Methods with relations =====
        public async Task<IEnumerable<Transaction>> GetAllWithRelationsAsync()
            => await _transactionRepository.GetAllWithRelationsAsync();

        public async Task<Transaction?> GetByIdWithRelationsAsync(int id)
            => await _transactionRepository.GetByIdWithRelationsAsync(id);
    }
}