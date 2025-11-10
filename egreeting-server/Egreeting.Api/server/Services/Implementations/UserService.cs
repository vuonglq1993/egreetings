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

        // ===== Override Create để hash password =====
        public override async Task<User> CreateAsync(User entity)
        {
            if (!string.IsNullOrWhiteSpace(entity.PasswordHash))
            {
                entity.PasswordHash = BCrypt.Net.BCrypt.HashPassword(entity.PasswordHash);
            }

            return await base.CreateAsync(entity);
        }

        // ===== Cập nhật toàn bộ user, hash password nếu có thay đổi =====
        public override async Task UpdateAsync(int id, User entity)
        {
            var existingUser = await GetByIdAsync(id);
            if (existingUser == null) throw new Exception("User not found");

            // Nếu password được gửi khác rỗng và khác password cũ => hash
            if (!string.IsNullOrWhiteSpace(entity.PasswordHash) &&
                !BCrypt.Net.BCrypt.Verify(entity.PasswordHash, existingUser.PasswordHash))
            {
                entity.PasswordHash = BCrypt.Net.BCrypt.HashPassword(entity.PasswordHash);
            }
            else
            {
                // Giữ password cũ nếu không có thay đổi
                entity.PasswordHash = existingUser.PasswordHash;
            }

            await base.UpdateAsync(id, entity);
        }

        // ===== Cập nhật password riêng =====
        public async Task UpdatePasswordAsync(int userId, string newPassword)
        {
            var user = await GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await base.UpdateAsync(userId, user);
        }

        // ===== Get all với relations =====
        public async Task<IEnumerable<User>> GetAllWithRelationsAsync()
            => await _userRepository.GetAllWithRelationsAsync();

        // ===== Get by id với relations =====
        public async Task<User?> GetByIdWithRelationsAsync(int id)
            => await _userRepository.GetByIdWithRelationsAsync(id);

        // ===== Kiểm tra login =====
        public async Task<bool> VerifyPasswordAsync(string email, string plainPassword)
        {
            var allUsers = await _userRepository.GetAllAsync(u => u.Email == email);
            var user = allUsers.FirstOrDefault();
            if (user == null) return false;

            return BCrypt.Net.BCrypt.Verify(plainPassword, user.PasswordHash);
        }
    }
}
