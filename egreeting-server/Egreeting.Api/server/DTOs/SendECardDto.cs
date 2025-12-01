public class SendECardDto
{
    public int TemplateId { get; set; }
    public List<string> RecipientEmails { get; set; } = new();
    
    public string? PersonalizedImageUrl { get; set; }
}
