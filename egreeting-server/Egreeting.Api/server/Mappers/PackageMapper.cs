using server.DTOs;
using server.Models;

namespace server.Mappers
{
    public static class PackageMapper
    {
        public static PackageDTO ToDTO(Package package)
        {
            return new PackageDTO
            {
                Id = package.Id,
                Name = package.Name,
                Description = package.Description,
                Price = package.Price,
                IsActive = package.IsActive,
                CreatedAt = package.CreatedAt,
                SubscriptionCount = package.Subscriptions?.Count ?? 0
            };
        }
    }
}