using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionRecipientController : BaseController<SubscriptionRecipient>
    {
        private readonly ISubscriptionRecipientService _service;

        public SubscriptionRecipientController(ISubscriptionRecipientService service) : base(service)
        {
            _service = service;
        }

        // GET: api/subscriptionrecipient/with-relations
        [HttpGet("with-relations")]
        public async Task<IActionResult> GetAllWithRelations()
        {
            var data = await _service.GetAllWithRelationsAsync();
            return Ok(data);
        }

        // GET: api/subscriptionrecipient/5/with-relations
        [HttpGet("{id}/with-relations")]
        public async Task<IActionResult> GetByIdWithRelations(int id)
        {
            var data = await _service.GetByIdWithRelationsAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }
    }
}