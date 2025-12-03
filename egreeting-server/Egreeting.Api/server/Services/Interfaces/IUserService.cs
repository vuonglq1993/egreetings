using server.Models;
using BCrypt.Net;

namespace server.Services.Interfaces
{
    public interface IUserService : IBaseService<User>
    {
        Task<IEnumerable<User>> GetAllWithRelationsAsync();
        Task<User?> GetByIdWithRelationsAsync(int id);
        Task<bool> CheckEmailExistsAsync(string email); 
        Task UpdatePasswordAsync(int userId, string newPassword);
        Task<User?> GetByEmailAsync(string email);
        
    }
}