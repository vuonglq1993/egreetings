using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController<User>
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService) : base(userService)
        {
            _userService = userService;
        }

        [HttpGet("with-relations")]
        public async Task<IActionResult> GetAllWithRelations()
        {
            var data = await _userService.GetAllWithRelationsAsync();
            return Ok(data);
        }

        [HttpGet("{id}/with-relations")]
        public async Task<IActionResult> GetByIdWithRelations(int id)
        {
            var data = await _userService.GetByIdWithRelationsAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }
    }
}