using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class TransactionRepository : BaseRepository<Transaction>, ITransactionRepository
    {
        public TransactionRepository(EGreetingDbContext context) : base(context) { }

        // ===== Include relations =====
        public async Task<IEnumerable<Transaction>> GetAllWithRelationsAsync()
        {
            return await _dbSet
                .Include(t => t.User)
                .Include(t => t.Template)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Transaction?> GetByIdWithRelationsAsync(int id)
        {
            return await _dbSet
                .Include(t => t.User)
                .Include(t => t.Template)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }
    }
}