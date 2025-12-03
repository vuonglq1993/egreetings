namespace server.DTOs
{
    public class TransactionDTO
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? TemplateId { get; set; }
        public string RecipientEmail { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = "Completed";
        public DateTime SentAt { get; set; }

        // Joined data
        public string? UserName { get; set; }
        public string? TemplateTitle { get; set; }
    }
}