using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class PackageRepository : BaseRepository<Package>, IPackageRepository
    {
        private readonly EGreetingDbContext _context;

        public PackageRepository(EGreetingDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Package>> GetActivePackagesAsync()
        {
            return await _context.Packages
                .AsNoTracking()
                .Where(p => p.IsActive == true)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }
    }
}