using server.Models;

namespace server.Repositories.Interfaces
{
    public interface ITransactionRepository : IBaseRepository<Transaction>
    {
        Task<IEnumerable<Transaction>> GetAllWithRelationsAsync();
        Task<Transaction?> GetByIdWithRelationsAsync(int id);
    }
}