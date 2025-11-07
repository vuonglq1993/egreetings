using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class PackageRepository : BaseRepository<Package>, IPackageRepository
    {
        public PackageRepository(EGreetingDbContext context) : base(context) { }
    
        public async Task<IEnumerable<Package>> GetAllWithSubscriptionsAsync()
        {
            return await _dbSet
                .Include(p => p.Subscriptions)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Package?> GetByIdWithSubscriptionsAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Subscriptions)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}