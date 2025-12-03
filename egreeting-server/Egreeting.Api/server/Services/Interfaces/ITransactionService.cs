using server.Models;
using System.Collections.Generic;

namespace server.Services.Interfaces
{
    public interface ITransactionService : IBaseService<Transaction>
    {
        Task<IEnumerable<Transaction>> GetAllWithRelationsAsync();
        Task<Transaction?> GetByIdWithRelationsAsync(int id);
    }
}