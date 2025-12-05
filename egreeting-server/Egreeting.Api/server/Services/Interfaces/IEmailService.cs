namespace server.Services.Interfaces
{
    public interface IEmailService
{
    Task SendEmailAsync(string recipientEmail, string subject, string htmlBody, string? imageUrl = null);
}
}