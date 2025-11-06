using server.Models;

namespace server.Repositories.Interfaces
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetActiveUsersAsync();
        Task<IEnumerable<User>> GetByRoleAsync(string role);
        Task<bool> ChangeStatusAsync(int userId, bool status);
    }
}