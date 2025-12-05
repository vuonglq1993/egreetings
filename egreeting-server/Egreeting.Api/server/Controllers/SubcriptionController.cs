using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : BaseController<Subscription>
    {
        private readonly ISubscriptionService _subscriptionService;
        private readonly EGreetingDbContext _db;

        public SubscriptionController(
            ISubscriptionService subscriptionService,
            EGreetingDbContext db
        ) : base(subscriptionService)
        {
            _subscriptionService = subscriptionService;
            _db = db;
        }

        // -------------------------------------------------------------
        // 1️⃣ SAVE RECIPIENT EMAILS (thay cho send)
        // -------------------------------------------------------------
        [HttpPost("save")]
        public async Task<IActionResult> SaveRecipients([FromBody] SendECardDto dto)
        {
            if (!HttpContext.Items.TryGetValue("UserId", out var userIdObj))
                return Unauthorized("User not logged in.");

            int userId = (int)userIdObj;

            // Check subscription
            var sub = await _subscriptionService.GetActiveSubscriptionForUserAsync(userId);
            if (sub == null)
                return BadRequest("You don't have an active subscription.");

            if (dto.RecipientEmails == null || dto.RecipientEmails.Count < 10)
                return BadRequest("At least 10 recipient emails required.");

            // Save to SubscriptionRecipients table
            foreach (var email in dto.RecipientEmails)
            {
                _db.SubscriptionRecipients.Add(new SubscriptionRecipient
                {
                    SubscriptionId = sub.Id,
                    RecipientEmail = email
                });
            }

            await _db.SaveChangesAsync();

            return Ok(new { message = "Recipients saved successfully" });
        }

        // -------------------------------------------------------------
        // 2️⃣ GET MY SUBSCRIPTION (combined duration)
        // -------------------------------------------------------------
        [HttpGet("my")]
        public async Task<IActionResult> GetMySubscription()
        {
            if (!HttpContext.Items.TryGetValue("UserId", out var userIdObj))
                return Unauthorized("User not logged in.");

            int userId = (int)userIdObj;

            var summary = await _subscriptionService.GetUserSubscriptionSummaryAsync(userId);

            if (summary == null)
                return NotFound("No subscription found.");

            return Ok(summary);
        }
    }
}
