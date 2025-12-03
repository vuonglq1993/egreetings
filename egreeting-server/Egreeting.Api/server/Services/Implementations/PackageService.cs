using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class PackageService : BaseService<Package>, IPackageService
    {
        private readonly IPackageRepository _packageRepository;

        public PackageService(IPackageRepository packageRepository) : base(packageRepository)
        {
            _packageRepository = packageRepository;
        }

        public async Task<IEnumerable<Package>> GetAllWithRelationsAsync()
            => await _packageRepository.GetAllWithRelationsAsync();

        public async Task<Package?> GetByIdWithRelationsAsync(int id)
            => await _packageRepository.GetByIdWithRelationsAsync(id);
    }
}