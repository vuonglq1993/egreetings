using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Implementations;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionController : BaseController<Subscription>
    {
        private readonly SubscriptionService _service;

        public SubscriptionController(SubscriptionService service) : base(service)
        {
            _service = service;
        }

        [HttpGet("with-relations")]
        public async Task<IActionResult> GetAllWithRelations()
        {
            var data = await _service.GetAllWithRelationsAsync();
            return Ok(data);
        }

        [HttpGet("with-relations/{id}")]
        public async Task<IActionResult> GetByIdWithRelations(int id)
        {
            var item = await _service.GetByIdWithRelationsAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}