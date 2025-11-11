using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Implementations;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionRecipientController : BaseController<SubscriptionRecipient>
    {
        private readonly SubscriptionRecipientService _service;

        public SubscriptionRecipientController(SubscriptionRecipientService service) : base(service)
        {
            _service = service;
        }

        [HttpGet("with-subscription")]
        public async Task<IActionResult> GetAllWithSubscription()
        {
            var data = await _service.GetAllWithSubscriptionAsync();
            return Ok(data);
        }

        [HttpGet("with-subscription/{id}")]
        public async Task<IActionResult> GetByIdWithSubscription(int id)
        {
            var item = await _service.GetByIdWithSubscriptionAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}