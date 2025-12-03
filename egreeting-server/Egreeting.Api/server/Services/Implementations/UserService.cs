using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;
using BCrypt.Net;

namespace server.Services.Implementations
{
    public class UserService : BaseService<User>, IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository) : base(userRepository)
        {
            _userRepository = userRepository;
        }

        public override async Task<User> CreateAsync(User entity)
        {
            if (!string.IsNullOrWhiteSpace(entity.PasswordHash))
            {
                entity.PasswordHash = BCrypt.Net.BCrypt.HashPassword(entity.PasswordHash);
            }

            return await base.CreateAsync(entity);
        }

        public override async Task UpdateAsync(int id, User entity)
        {
            var existingUser = await GetByIdAsync(id);
            if (existingUser == null) throw new Exception("User not found");

            entity.PasswordHash = existingUser.PasswordHash;

            await base.UpdateAsync(id, entity);
        }

        public async Task UpdatePasswordAsync(int userId, string newPassword)
        {
            var user = await GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await base.UpdateAsync(userId, user);
        }

        public async Task<IEnumerable<User>> GetAllWithRelationsAsync()
        {
            return await _userRepository.GetAllWithRelationsAsync();
        }

        public async Task<User?> GetByIdWithRelationsAsync(int id)
        {
            return await _userRepository.GetByIdWithRelationsAsync(id);
        }

        public async Task<bool> CheckEmailExistsAsync(string email)
        {
            return await _userRepository.CheckEmailExistsAsync(email);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }
        public async Task DeleteAsync(int id)
{
    var user = await GetByIdAsync(id); // gọi method từ BaseService
    if (user == null)
        throw new Exception("User not found");

    await base.DeleteAsync(id); // gọi BaseService xóa thực tế
}


    }
}
