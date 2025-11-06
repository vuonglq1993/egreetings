using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(EGreetingDbContext context) : base(context) { }

        private EGreetingDbContext AppContext => (EGreetingDbContext)_context;

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<User>> GetActiveUsersAsync()
        {
            return await _dbSet.Where(u => u.Status == true).ToListAsync();
        }

        public async Task<IEnumerable<User>> GetByRoleAsync(string role)
        {
            return await _dbSet.Where(u => u.Role == role).ToListAsync();
        }

        public async Task<bool> ChangeStatusAsync(int userId, bool status)
        {
            var user = await _dbSet.FindAsync(userId);
            if (user == null) return false;

            user.Status = status;
            return await _context.SaveChangesAsync() > 0;
        }
    }
}