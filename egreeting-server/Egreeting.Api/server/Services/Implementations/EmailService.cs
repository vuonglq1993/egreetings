using MailKit.Net.Smtp;
using MimeKit;
using server.Services.Interfaces;
using System.Net.Http;

namespace server.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public EmailService(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
        }

        public async Task SendEmailAsync(string recipientEmail, string subject, string htmlBody, string? imageUrl = null)
        {
            var fromEmail = _config["Email:Username"];
            var appPassword = _config["Email:Password"];

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("EGreeting Service", fromEmail));
            message.To.Add(MailboxAddress.Parse(recipientEmail));
            message.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = htmlBody };

            if (!string.IsNullOrEmpty(imageUrl))
            {
                try
                {
                    // Nếu imageUrl là URL trực tuyến, tải về byte[]
                    byte[] imageBytes;
                    if (imageUrl.StartsWith("http"))
                    {
                        var client = _httpClientFactory.CreateClient();
                        imageBytes = await client.GetByteArrayAsync(imageUrl);
                        var image = builder.LinkedResources.Add("ecard.png", imageBytes);
                        image.ContentId = Guid.NewGuid().ToString();
                        builder.HtmlBody += $"<br><img src=\"cid:{image.ContentId}\" alt=\"E-Card\" />";
                    }
                    else
                    {
                        // file local
                        var image = builder.LinkedResources.Add(imageUrl);
                        image.ContentId = Guid.NewGuid().ToString();
                        builder.HtmlBody += $"<br><img src=\"cid:{image.ContentId}\" alt=\"E-Card\" />";
                    }
                }
                catch
                {
                    // fallback nếu load ảnh lỗi
                    builder.HtmlBody = htmlBody;
                }
            }

            message.Body = builder.ToMessageBody();

            using var clientSmtp = new SmtpClient();
            await clientSmtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await clientSmtp.AuthenticateAsync(fromEmail, appPassword);
            await clientSmtp.SendAsync(message);
            await clientSmtp.DisconnectAsync(true);
        }
    }
}
