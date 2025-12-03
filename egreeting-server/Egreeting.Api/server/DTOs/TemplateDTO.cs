namespace server.DTOs
{
    public class TemplateCreateDTO
    {
        public int CategoryId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? VideoUrl { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
    }

    public class TemplateDTO
    {
        public int Id { get; set; }
        public int? CategoryId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? VideoUrl { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        // Optional joined info
        public string? CategoryName { get; set; }

        // Optional stats
        public int TransactionCount { get; set; }
    }
}