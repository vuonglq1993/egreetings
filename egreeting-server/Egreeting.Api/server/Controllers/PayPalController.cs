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

    // ============================
// CREATE PAYMENT FOR PACKAGE
// ============================
[Authorize]
[HttpPost("pay-package")]
public async Task<IActionResult> CreatePackagePayment([FromQuery] int packageId)
{
    var package = await _db.Packages.FindAsync(packageId);

    if (package == null)
        return NotFound(new { message = "Package not found" });

    if (!package.IsActive)
        return BadRequest(new { message = "This package is inactive" });

    // Lấy user từ token
    int userId = int.Parse(User.FindFirst("id")?.Value ?? "0");

    // Tạo subscription pending
    var subscription = new Subscription
    {
        UserId = userId,
        PackageId = package.Id,
        StartDate = DateOnly.FromDateTime(DateTime.UtcNow),
        EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(package.DurationMonths)),
        IsActive = false,
        PaymentStatus = "Pending"
    };

    _db.Subscriptions.Add(subscription);
    await _db.SaveChangesAsync();

    // PayPal redirect
    var baseUrl = $"{Request.Scheme}://{Request.Host}";
    var returnUrl = $"{baseUrl}/api/paypal/package-success?packageId={packageId}&subId={subscription.Id}";
    var cancelUrl = $"{baseUrl}/api/paypal/cancel";

    var approvalUrl = await _paypalService.CreatePayment(package.Price, returnUrl, cancelUrl);

    return Ok(new { approval_url = approvalUrl });
}

    // ============================
// PACKAGE PAYMENT SUCCESS (REDIRECT TO FE)
// ============================
[HttpGet("package-success")]
public IActionResult PackageSuccess([FromQuery] string token, [FromQuery] int packageId, [FromQuery] int subId)
{
    return Redirect($"http://localhost:5173/payment-success?packageId={packageId}&paymentId={token}&subId={subId}");
}
// ============================
// EXECUTE PACKAGE PAYMENT
// ============================
[Authorize]
[HttpPost("execute-package")]
public async Task<IActionResult> ExecutePackagePayment([FromBody] ExecutePackageRequest req)
{
    int userId = int.Parse(User.FindFirst("id")?.Value ?? "0");

    var success = await _paypalService.CapturePayment(req.PaymentId);
    if (!success)
        return BadRequest(new { message = "Payment execution failed" });

    var subscription = await _db.Subscriptions.FindAsync(req.SubscriptionId);
    if (subscription == null)
        return NotFound(new { message = "Subscription not found" });

    // 1️⃣ Activate subscription
    subscription.PaymentStatus = "Completed";
    subscription.IsActive = true;

    // 2️⃣ Update user role
    var user = await _db.Users.FindAsync(userId);
    if (user != null && user.Role == "User")
    {   
        user.Role = "Subscribe"; // chuyển role
        _db.Users.Update(user);
    }

    await _db.SaveChangesAsync();

    return Ok(new { message = "Subscription activated successfully" });
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
public class ExecutePackageRequest
{
    public string PaymentId { get; set; } = null!;
    public int PackageId { get; set; }
    public int SubscriptionId { get; set; }
}

