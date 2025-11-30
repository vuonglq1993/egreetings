using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // nếu dùng [Authorize]
using server.Models;
using server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization; // cần để dùng [Authorize]

[ApiController]
[Route("api/[controller]")]
public class PayPalController : ControllerBase
{
    private readonly IPayPalService _paypalService;
    private readonly EGreetingDbContext _db;

    public PayPalController(IPayPalService paypalService, EGreetingDbContext db)
    {
        _paypalService = paypalService;
        _db = db;
    }

    // ============================
    // CREATE PAYPAL PAYMENT
    // ============================
    [HttpPost("pay")]
    public async Task<IActionResult> CreatePayment([FromQuery] int templateId)
    {
        var template = await _db.Templates.FindAsync(templateId);

        if (template == null)
            return NotFound(new { message = "Template not found" });

        if (template.Price <= 0)
            return BadRequest(new { message = "This template is free" });

        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var returnUrl = $"{baseUrl}/api/paypal/success?templateId={templateId}";
        var cancelUrl = $"{baseUrl}/api/paypal/cancel";

        var approvalUrl = await _paypalService.CreatePayment(template.Price, returnUrl, cancelUrl);

        return Ok(new { approval_url = approvalUrl });
    }

    // ============================
    // PAYMENT SUCCESS
    // ============================
            [HttpGet("success")]
        public IActionResult PaymentSuccess([FromQuery] string token, [FromQuery] int templateId)
        {
            // Redirect kèm token để FE gọi /execute
            return Redirect($"http://localhost:5173/payment-success?templateId={templateId}&paymentId={token}");
        }

    // ============================
    // PAYMENT CANCEL
    // ============================
    [HttpGet("cancel")]
    public IActionResult PaymentCancel()
    {
        return BadRequest(new { message = "Payment cancelled" });
    }

    // ============================
    // EXECUTE PAYMENT (mới)
    // ============================
    [Authorize] // bắt buộc gửi JWT token
    [HttpPost("execute")]
    public async Task<IActionResult> ExecutePayment([FromBody] ExecuteRequest request)
    {
        // Lấy userId từ JWT claims
        int userId = int.Parse(User.FindFirst("id")?.Value ?? "0");

        var user = await _db.Users.FindAsync(userId);
        if (user == null)
            return Unauthorized(new { message = "User not found" });

        // Gọi service PayPal capture payment
        var success = await _paypalService.CapturePayment(request.PaymentId);
        if (!success)
            return BadRequest(new { message = "Payment execution failed" });

        // Lưu transaction
        var template = await _db.Templates.FindAsync(request.TemplateId);
        if (template == null)
            return NotFound(new { message = "Template not found" });

        var transaction = new Transaction
        {
            UserId = userId,
            TemplateId = template.Id,
            RecipientEmail = request.RecipientEmail ?? "",
            Subject = request.Subject,
            Message = request.Message,
            Price = template.Price,
            PaymentMethod = "PayPal",
            PaymentStatus = "Completed",
            SentAt = DateTime.UtcNow
        };

        _db.Transactions.Add(transaction);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Payment executed successfully" });
    }
}

// DTO để nhận body request
public class ExecuteRequest
{
    public string PaymentId { get; set; } = null!;
    public int TemplateId { get; set; }
    public string? RecipientEmail { get; set; }
    public string? Subject { get; set; }
    public string? Message { get; set; }
}
