using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Implementations;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : BaseController<User>
    {
        private readonly UserService _userService;

        public UserController(UserService userService) : base(userService)
        {
            _userService = userService;
        }

        // Get all users with related data (Feedbacks, Subscriptions, Transactions)
        [HttpGet("with-relations")]
        public async Task<IActionResult> GetAllWithRelations()
        {
            var users = await _userService.GetAllWithRelationsAsync();
            return Ok(users);
        }

        // Get single user with relationships
        [HttpGet("{id}/details")]
        public async Task<IActionResult> GetUserWithRelations(int id)
        {
            var user = await _userService.GetByIdWithRelationsAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

        // Example of keyword search (by FullName or Email)
        [HttpGet("search")]
        public override async Task<IActionResult> Search([FromQuery] string keyword)
        {
            var results = await _userService.SearchAsync(
                keyword,
                u => u.FullName,
                u => u.Email
            );

            return Ok(results);
        }
    }
}