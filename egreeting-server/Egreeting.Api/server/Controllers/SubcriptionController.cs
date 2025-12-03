using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;
using server.DTOs;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : BaseController<Subscription>
    {
        private readonly ISubscriptionService _subscriptionService;

        public SubscriptionController(ISubscriptionService subscriptionService) : base(subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        // GET: api/subscription/with-relations
        [HttpGet("with-relations")]
        public async Task<IActionResult> GetAllWithRelations()
        {
            var data = await _subscriptionService.GetAllWithRelationsAsync();
            return Ok(data);
        }

        // GET: api/subscription/5/with-relations
        [HttpGet("{id}/with-relations")]
        public async Task<IActionResult> GetByIdWithRelations(int id)
        {
            var data = await _subscriptionService.GetByIdWithRelationsAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }
        [HttpPost("create")] 
        public async Task<IActionResult> Create([FromBody] CreateSubscriptionDto dto)
        {
            var subscription = new Subscription
            {
                UserId = dto.UserId,
                PackageId = dto.PackageId,           
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                PaymentStatus = dto.PaymentStatus ?? "Pending",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            await _subscriptionService.CreateAsync(subscription);
            return Ok(subscription);
        }
    }
}