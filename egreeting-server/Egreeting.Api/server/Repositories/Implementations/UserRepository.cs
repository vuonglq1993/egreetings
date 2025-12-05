using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using server.Models;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(EGreetingDbContext context) : base(context) { }

        public async Task<IEnumerable<User>> GetAllWithRelationsAsync(
            Expression<Func<User, bool>>? filter = null,
            Func<IQueryable<User>, IOrderedQueryable<User>>? orderBy = null)
        {
            IQueryable<User> query = _dbSet
                .Include(u => u.Feedbacks)
                .Include(u => u.Subscriptions)
                .Include(u => u.Transactions);

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null)
                query = orderBy(query);

            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<User?> GetByIdWithRelationsAsync(int id)
        {
            return await _dbSet
                .Include(u => u.Feedbacks)
                .Include(u => u.Subscriptions)
                .Include(u => u.Transactions)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);
        }
        public async Task<bool> CheckEmailExistsAsync(string email)
        {
            return await _dbSet.AnyAsync(u => u.Email == email);
        }
    }
}