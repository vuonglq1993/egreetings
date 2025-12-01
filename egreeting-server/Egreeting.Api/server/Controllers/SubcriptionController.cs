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
        private readonly IEmailService _emailService;

        public SubscriptionController(
            ISubscriptionService subscriptionService,
            EGreetingDbContext db,
            IEmailService emailService
        ) : base(subscriptionService)
        {
            _subscriptionService = subscriptionService;
            _db = db;
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendSubscription([FromBody] SendECardDto dto)
        {
            if (dto.RecipientEmails == null || dto.RecipientEmails.Count == 0)
                return BadRequest("No recipient emails provided.");

            // Lấy template từ DB
            var template = await _db.Templates.FindAsync(dto.TemplateId);
            if (template == null) return NotFound("Template not found");

            foreach (var email in dto.RecipientEmails)
            {
                await _emailService.SendEmailAsync(
                    email,
                    $"Your Daily E-Card: {template.Title}",
                    $"<h3>Here is your e-card!</h3>",
                    template.ImageUrl // Lấy ảnh trực tiếp từ template
                );
            }

            return Ok(new { message = "Emails sent successfully" });
        }
    }

    public class SendECardDto
    {
        public int TemplateId { get; set; }
        public List<string> RecipientEmails { get; set; } = new List<string>();
    }
}
