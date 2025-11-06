namespace server.DTOs
{
    public class UserDTO
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = "User";
        public bool Status { get; set; } = true;
    }
}