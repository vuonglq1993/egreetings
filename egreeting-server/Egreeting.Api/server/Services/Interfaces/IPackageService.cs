using server.DTOs;
using server.Models;
using System.Collections.Generic;

namespace server.Services.Interfaces
{
    public interface IPackageService : IBaseService<Package>
    {
        Task<IEnumerable<PackageDTO>> GetAllWithRelationsAsync();
        Task<PackageDTO?> GetByIdWithRelationsAsync(int id);
    }
}
