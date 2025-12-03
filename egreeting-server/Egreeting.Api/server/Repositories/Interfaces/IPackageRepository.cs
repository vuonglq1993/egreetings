using server.Models;
using System.Linq.Expressions;

namespace server.Repositories.Interfaces
{
    public interface IPackageRepository : IBaseRepository<Package>
    {
        Task<IEnumerable<Package>> GetAllWithRelationsAsync(
            Expression<Func<Package, bool>>? filter = null,
            Func<IQueryable<Package>, IOrderedQueryable<Package>>? orderBy = null);

        Task<Package?> GetByIdWithRelationsAsync(int id);
    }
}