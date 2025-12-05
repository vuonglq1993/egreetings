using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;
using System.Linq.Expressions;

namespace server.Repositories.Implementations
{
    public class TransactionRepository : BaseRepository<Transaction>, ITransactionRepository
    {
        public TransactionRepository(EGreetingDbContext context) : base(context) { }

        public async Task<IEnumerable<Transaction>> GetAllWithRelationsAsync(
            Expression<Func<Transaction, bool>>? filter = null,
            Func<IQueryable<Transaction>, IOrderedQueryable<Transaction>>? orderBy = null)
        {
            IQueryable<Transaction> query = _dbSet
                .Include(t => t.User)
                .Include(t => t.Template);

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null)
                query = orderBy(query);

            return await query.AsNoTracking().ToListAsync();
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