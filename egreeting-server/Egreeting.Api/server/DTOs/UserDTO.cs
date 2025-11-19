namespace server.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool Status { get; set; }
        public DateTime CreatedAt { get; set; }

        // Optional joined data summaries
        public int FeedbackCount { get; set; }
        public int SubscriptionCount { get; set; }
        public int TransactionCount { get; set; }
    }
    public class UpdateProfileRequest
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
    }
    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
        public string ConfirmPassword { get; set; } = null!;
    }}