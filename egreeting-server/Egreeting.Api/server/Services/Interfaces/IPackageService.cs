using server.DTOs;

namespace server.Services.Interfaces
{
    public interface IPackageService
    {
        Task<IEnumerable<PackageDTO>> GetAllAsync();
        Task<IEnumerable<PackageDTO>> GetActiveAsync();
        Task<PackageDTO?> GetByIdAsync(int id);
        Task<PackageDTO> CreateAsync(CreatePackageDTO dto);
        Task<bool> UpdateAsync(int id, UpdatePackageDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}