using server.DTOs;
using server.Models;
using BCrypt.Net;

namespace server.Mappers
{
    public static class UserMapper
    {
        public static User ToEntity(UserDTO dto)
        {
            return new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role ?? "User",
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow
            };
        }

        public static object ToResponse(User user)
        {
            return new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.Status,
                user.CreatedAt
            };
        }
    }
}