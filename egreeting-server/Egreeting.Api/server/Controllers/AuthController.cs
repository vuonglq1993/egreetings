using Microsoft.AspNetCore.Mvc;
using server.Helpers;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            var allUsers = await _userService.GetAllAsync();
            var user = allUsers.FirstOrDefault(u => u.Email == model.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            var token = _jwtHelper.GenerateToken(user);

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                Token = token
            });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}