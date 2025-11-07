using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class PackageService : BaseService<Package>, IPackageService
    {
        private readonly IPackageRepository _packageRepository; // <-- inject theo interface

        public PackageService(IPackageRepository packageRepository)
            : base(packageRepository)
        {
            _packageRepository = packageRepository;
        }

        // Ví dụ hàm đặc thù: lấy tất cả gói kèm subscriptions
        public async Task<IEnumerable<Package>> GetAllWithSubscriptionsAsync()
        {
            return await _packageRepository.GetAllWithSubscriptionsAsync();
        }

        // Ví dụ: tìm kiếm nâng cao trong Package (Name + Description)
        public async Task<IEnumerable<Package>> SearchPackagesAsync(string keyword)
        {
            return await base.SearchAsync(keyword, p => p.Name, p => p.Description);
        }
    }
}