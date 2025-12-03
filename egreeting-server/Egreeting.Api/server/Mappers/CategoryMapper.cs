using server.DTOs;
using server.Models;

namespace server.Mappers
{
    public static class CategoryMapper
    {
        public static CategoryDTO ToDTO(Category category)
        {
            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                TemplateCount = category.Templates?.Count ?? 0
            };
        }
    }
}