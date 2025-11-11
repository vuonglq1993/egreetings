using server.Models;

namespace server.Services.Interfaces
{
    public interface IUserService : IBaseService<User>
    {
        Task<IEnumerable<User>> GetAllWithRelationsAsync();
        Task<User?> GetByIdWithRelationsAsync(int id);
    }
}