namespace server.DTOs
{
    public class PackageDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
         public int DurationMonths { get; set; } 
        public DateTime CreatedAt { get; set; }

        // Optional stats
        public int SubscriptionCount { get; set; }
    }
    
}