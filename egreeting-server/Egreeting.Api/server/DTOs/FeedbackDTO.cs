namespace server.DTOs
{
    public class FeedbackDTO
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        // Optional joined data
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
    }
}