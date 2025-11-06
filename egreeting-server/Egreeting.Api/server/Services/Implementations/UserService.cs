using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User> CreateAsync(User user)
        {
            // ✅ Hash password before saving
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            user.Role ??= "User";
            user.Status = true;
            user.CreatedAt = DateTime.UtcNow;

            return await _userRepository.AddAsync(user);
        }

        public async Task<bool> UpdateAsync(int id, User updatedUser)
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null) return false;

            existing.FullName = updatedUser.FullName;
            existing.Email = updatedUser.Email;
            existing.Role = updatedUser.Role;
            existing.Status = updatedUser.Status;

            if (!string.IsNullOrEmpty(updatedUser.PasswordHash) &&
                !BCrypt.Net.BCrypt.Verify(updatedUser.PasswordHash, existing.PasswordHash))
            {
                existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.PasswordHash);
            }

            return await _userRepository.UpdateAsync(existing);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _userRepository.DeleteAsync(id);
        }

        public async Task<User?> AuthenticateAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return null;

            bool isValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            return isValid ? user : null;
        }

        public async Task<(IEnumerable<User> Data, int Total)> FilterAsync(
            string? search = null,
            string? sortBy = null,
            bool desc = false,
            int page = 1,
            int pageSize = 20)
        {
            var query = _userRepository.Query();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u =>
                    u.FullName.Contains(search) ||
                    u.Email.Contains(search) ||
                    u.Role.Contains(search));
            }

            if (!string.IsNullOrEmpty(sortBy))
            {
                query = desc
                    ? query.OrderByDescending(e => EF.Property<object>(e, sortBy))
                    : query.OrderBy(e => EF.Property<object>(e, sortBy));
            }

            int total = await query.CountAsync();
            var data = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return (data, total);
        }
    }
}
