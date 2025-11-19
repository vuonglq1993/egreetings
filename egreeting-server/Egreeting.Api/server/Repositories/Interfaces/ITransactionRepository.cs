using server.Models;
using System.Linq.Expressions;

namespace server.Repositories.Interfaces
{
    public interface ITransactionRepository : IBaseRepository<Transaction>
    {
        Task<IEnumerable<Transaction>> GetAllWithRelationsAsync(
            Expression<Func<Transaction, bool>>? filter = null,
            Func<IQueryable<Transaction>, IOrderedQueryable<Transaction>>? orderBy = null);

        Task<Transaction?> GetByIdWithRelationsAsync(int id);
    }
}