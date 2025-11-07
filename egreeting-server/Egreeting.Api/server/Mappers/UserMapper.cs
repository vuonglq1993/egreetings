using server.Models;
using server.DTOs;

namespace server.Mappers
{
    public static class UserMapper
    {
        public static UserDTO ToDto(User entity)
        {
            return new UserDTO
            {
                Id = entity.Id,
                FullName = entity.FullName,
                Email = entity.Email,
                Role = entity.Role,
                Status = entity.Status,
                CreatedAt = entity.CreatedAt,
                FeedbackCount = entity.Feedbacks?.Count ?? 0,
                SubscriptionCount = entity.Subscriptions?.Count ?? 0,
                TransactionCount = entity.Transactions?.Count ?? 0
            };
        }

        public static User ToEntity(UserDTO dto)
        {
            return new User
            {
                Id = dto.Id,
                FullName = dto.FullName,
                Email = dto.Email,
                Role = dto.Role,
                Status = dto.Status,
                CreatedAt = dto.CreatedAt
            };
        }
    }
}