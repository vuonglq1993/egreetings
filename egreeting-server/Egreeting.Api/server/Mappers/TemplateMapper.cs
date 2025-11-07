using server.DTOs;
using server.Models;

namespace server.Mappers
{
    public static class TemplateMapper
    {
        public static TemplateDTO ToDTO(Template template)
        {
            return new TemplateDTO
            {
                Id = template.Id,
                CategoryId = template.CategoryId,
                Title = template.Title,
                ImageUrl = template.ImageUrl,
                VideoUrl = template.VideoUrl,
                Price = template.Price,
                IsActive = template.IsActive,
                CreatedAt = template.CreatedAt,
                CategoryName = template.Category?.Name,
                TransactionCount = template.Transactions?.Count ?? 0
            };
        }
    }
}