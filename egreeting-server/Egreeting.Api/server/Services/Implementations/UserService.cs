using server.Models;
using server.Repositories.Implementations;

namespace server.Services.Implementations
{
    public class UserService : BaseService<User>
    {
        private readonly UserRepository _userRepository;

        public UserService(UserRepository userRepository) : base(userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllWithRelationsAsync()
        {
            return await _userRepository.GetAllWithRelationsAsync();
        }

        public async Task<User?> GetByIdWithRelationsAsync(int id)
        {
            return await _userRepository.GetByIdWithRelationsAsync(id);
        }
    }
}