using server.DTOs;
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

        public async Task<IEnumerable<PackageDTO>> GetAllWithRelationsAsync()
        {
            var data = await _packageRepository.GetAllWithRelationsAsync();

            return data.Select(p => new PackageDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                DurationMonths = p.DurationMonths,
                Price = p.Price,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                SubscriptionCount = p.Subscriptions?.Count() ?? 0
            });
        }

        public async Task<PackageDTO?> GetByIdWithRelationsAsync(int id)
        {
            var p = await _packageRepository.GetByIdWithRelationsAsync(id);
            if (p == null) return null;

            return new PackageDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                DurationMonths = p.DurationMonths,
                Price = p.Price,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                SubscriptionCount = p.Subscriptions?.Count() ?? 0
            };
        }
    }
}
