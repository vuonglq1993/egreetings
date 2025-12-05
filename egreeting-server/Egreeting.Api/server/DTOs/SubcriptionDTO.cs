using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class SubscriptionDTO
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? PackageId { get; set; }
        public bool IsActive { get; set; }
        public string PaymentStatus { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; }

        // Joined data
        public string? UserName { get; set; }
        public string? PackageName { get; set; }

        // Count of recipients
        public int RecipientCount { get; set; }
    }

    public class CreateSubscriptionDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int PackageId { get; set; }     

        [Required]
        public DateOnly StartDate { get; set; }

        [Required]
        public DateOnly EndDate { get; set; }

        public string? PaymentStatus { get; set; } = "Pending";
    }
    public class SendECardDto   
{
    public int TemplateId { get; set; }
    public List<string> RecipientEmails { get; set; } = new List<string>();
}
public class SubscriptionSummaryDto
{
    public string PackageName { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public int TotalDays { get; set; }
    public decimal TotalPrice { get; set; }
    public bool IsExpired { get; set; }
}
}