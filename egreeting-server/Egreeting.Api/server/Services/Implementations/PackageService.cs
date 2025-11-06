using server.DTOs;
using server.Mappers;
using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class PackageService : IPackageService
    {
        private readonly IPackageRepository _repository;

        public PackageService(IPackageRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PackageDTO>> GetAllAsync()
        {
            var packages = await _repository.GetAllAsync();
            return packages.Select(p => p.ToDTO());
        }

        public async Task<IEnumerable<PackageDTO>> GetActiveAsync()
        {
            var packages = await _repository.GetActivePackagesAsync();
            return packages.Select(p => p.ToDTO());
        }

        public async Task<PackageDTO?> GetByIdAsync(int id)
        {
            var package = await _repository.GetByIdAsync(id);
            return package?.ToDTO();
        }

        public async Task<PackageDTO> CreateAsync(CreatePackageDTO dto)
        {
            var entity = dto.ToEntity();
            await _repository.AddAsync(entity);
            return entity.ToDTO();
        }

        public async Task<bool> UpdateAsync(int id, UpdatePackageDTO dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return false;

            existing.UpdateEntity(dto);
            return await _repository.UpdateAsync(existing);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}