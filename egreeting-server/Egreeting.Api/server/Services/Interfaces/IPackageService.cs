using server.Models;
using System.Collections.Generic;

namespace server.Services.Interfaces
{
    public interface IPackageService : IBaseService<Package>
    {
        Task<IEnumerable<Package>> GetAllWithRelationsAsync();
        Task<Package?> GetByIdWithRelationsAsync(int id);
    }
}