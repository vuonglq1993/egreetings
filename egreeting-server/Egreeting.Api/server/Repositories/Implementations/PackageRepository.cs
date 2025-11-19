using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;
using System.Linq.Expressions;

namespace server.Repositories.Implementations
{
    public class PackageRepository : BaseRepository<Package>, IPackageRepository
    {
        public PackageRepository(EGreetingDbContext context) : base(context) { }

        public async Task<IEnumerable<Package>> GetAllWithRelationsAsync(
            Expression<Func<Package, bool>>? filter = null,
            Func<IQueryable<Package>, IOrderedQueryable<Package>>? orderBy = null)
        {
            IQueryable<Package> query = _dbSet
                .Include(p => p.Subscriptions); 

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null)
                query = orderBy(query);

            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<Package?> GetByIdWithRelationsAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Subscriptions)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}