using server.DTOs;
using server.Models;

namespace server.Mappers
{
    public static class PackageMapper
    {
        public static PackageDTO ToDTO(this Package package)
        {
            return new PackageDTO
            {
                Id = package.Id,
                Name = package.Name,
                Description = package.Description,
                Price = package.Price,
                IsActive = package.IsActive,
                CreatedAt = package.CreatedAt
            };
        }

        public static Package ToEntity(this CreatePackageDTO dto)
        {
            return new Package
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
        }

        public static void UpdateEntity(this Package entity, UpdatePackageDTO dto)
        {
            entity.Name = dto.Name;
            entity.Description = dto.Description;
            entity.Price = dto.Price;
            entity.IsActive = dto.IsActive ?? entity.IsActive;
        }
    }
}