using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using server.DTOs;
using BCrypt.Net;
using System;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/users/with-relations
        [HttpGet("with-relations")]
        public async Task<IActionResult> GetAllWithRelations()
        {
            var data = await _userService.GetAllWithRelationsAsync();
            return Ok(data);
        }

        // GET: api/users/{id}/with-relations
        [HttpGet("{id}/with-relations")]
        public async Task<IActionResult> GetByIdWithRelations(int id)
        {
            var data = await _userService.GetByIdWithRelationsAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }

        // GET: api/users/check-email?email=xxx
        [HttpGet("check-email")]
        public async Task<IActionResult> CheckEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required");

            var exists = await _userService.CheckEmailExistsAsync(email);
            return Ok(new { exists });
        }

        // GET: api/users/me
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = int.Parse(User.FindFirst("id")!.Value);
            var user = await _userService.GetByIdWithRelationsAsync(userId);
            if (user == null) return NotFound();

            var dto = new UserDTO
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Status = user.Status,
                CreatedAt = user.CreatedAt,
                FeedbackCount = user.Feedbacks?.Count ?? 0,
                SubscriptionCount = user.Subscriptions?.Count ?? 0,
                TransactionCount = user.Transactions?.Count ?? 0
            };

            return Ok(dto);
        }

        // PUT: api/users/update-profile
        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = int.Parse(User.FindFirst("id")!.Value);
            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound();

            user.FullName = request.FullName ?? user.FullName;
            user.Email = request.Email ?? user.Email;

            await _userService.UpdateAsync(user.Id, user);
            return Ok(new { message = "Profile updated successfully" });
        }

        // PUT: api/users/change-password
        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = int.Parse(User.FindFirst("id")!.Value);
            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound();

            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
                return BadRequest(new { message = "Current password is incorrect" });

            if (BCrypt.Net.BCrypt.Verify(request.NewPassword, user.PasswordHash))
                return BadRequest(new { message = "New password must be different from current password" });

            await _userService.UpdatePasswordAsync(userId, request.NewPassword);

            return Ok(new { message = "Password changed successfully!" });
        }

        // PUT: api/users/{id} - Admin update user
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User userData)
        {
            if (userData == null) return BadRequest("Invalid data");
            
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            // Cập nhật các trường
            user.FullName = userData.FullName;
            user.Email = userData.Email;
            user.Role = userData.Role;
            user.Status = userData.Status;
            // Không cập nhật password từ đây

            await _userService.UpdateAsync(id, user);
            return NoContent();
        }

        // POST: api/users - Admin create user
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUser([FromBody] User userData)
        {
            if (userData == null) return BadRequest("Invalid data");
            
            // Tạo user mới
            var newUser = new User
            {
                FullName = userData.FullName,
                Email = userData.Email,
                Role = userData.Role ?? "User",
                Status = userData.Status,
                PasswordHash = userData.PasswordHash, // Sẽ được hash trong service
                CreatedAt = DateTime.UtcNow
            };

            var created = await _userService.CreateAsync(newUser);
            return Ok(created);
        }

        // DELETE: api/users/{id}/delete
        [HttpDelete("{id}/delete")]
        [Authorize(Roles = "Admin")] // chỉ admin mới xóa được
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            await _userService.DeleteAsync(id);
            return Ok(new { message = "User deleted successfully" });
        }
    }
}
