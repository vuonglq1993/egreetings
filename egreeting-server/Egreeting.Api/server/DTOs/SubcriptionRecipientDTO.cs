namespace server.DTOs
{
    public class SubscriptionRecipientDTO
    {
        public int Id { get; set; }
        public int? SubscriptionId { get; set; }
        public string RecipientEmail { get; set; } = string.Empty;

        // Optional joined info
        public string? SubscriptionUserName { get; set; }
    }
}