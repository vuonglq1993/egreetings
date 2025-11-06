using server.Models;

namespace server.Repositories.Interfaces
{
    public interface IPackageRepository : IBaseRepository<Package>
    {
        Task<IEnumerable<Package>> GetActivePackagesAsync();
    }
}