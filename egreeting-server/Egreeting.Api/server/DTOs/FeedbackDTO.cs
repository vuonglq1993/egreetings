namespace server.DTOs
{
    public class FeedbackDTO
    {
        public int Id { get; set; }
        public string? Message { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? UserName { get; set; }
    }

    public class CreateFeedbackDTO
    {
        public int? UserId { get; set; }
        public string Message { get; set; } = null!;
    }

    public class UpdateFeedbackDTO
    {
        public string Message { get; set; } = null!;
    }
}