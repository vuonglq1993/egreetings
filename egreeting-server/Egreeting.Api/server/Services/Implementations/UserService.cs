using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class UserService : BaseService<User>, IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository) : base(userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllWithRelationsAsync()
            => await _userRepository.GetAllWithRelationsAsync();

        public async Task<User?> GetByIdWithRelationsAsync(int id)
            => await _userRepository.GetByIdWithRelationsAsync(id);
    }
}