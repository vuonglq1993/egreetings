using server.Models;

namespace server.Services.Interfaces
{
    public interface IUserService : IBaseService<User>
    {
        Task<User?> AuthenticateAsync(string email, string password);
        Task<(IEnumerable<User> Data, int Total)> FilterAsync(
            string? search = null,
            string? sortBy = null,
            bool desc = false,
            int page = 1,
            int pageSize = 20);
    }
}