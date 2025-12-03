using Microsoft.AspNetCore.Mvc;
using server.Helpers;
using server.Models;
using server.Services.Interfaces;
using System.Linq;
using BCrypt.Net;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly JwtHelper _jwtHelper;

        public AuthController(IUserService userService, JwtHelper jwtHelper)
        {
            _userService = userService;
            _jwtHelper = jwtHelper;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Lấy user theo email
            var user = await _userService.GetByEmailAsync(request.Email);

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            // Kiểm tra password
            var validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!validPassword)
                return Unauthorized(new { message = "Invalid email or password" });

            // Tạo JWT token
            var token = _jwtHelper.GenerateToken(user, 60 * 24); // 24h

            // Trả về JSON đầy đủ
            return Ok(new
            {
                token,
                role = user.Role, // cần frontend lưu role
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            });
        }
    }

    // DTO
    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
