namespace server.DTOs
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Optional statistics
        public int TemplateCount { get; set; }
    }
}