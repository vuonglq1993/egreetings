using server.Helpers;
using server.Models;
using server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

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
            var users = await _userService.GetAllWithRelationsAsync();
            var user = users.FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!validPassword)
                return Unauthorized(new { message = "Invalid email or password" });

            var token = _jwtHelper.GenerateToken(user, 60 * 24);

            return Ok(new
            {
                token,
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

    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}