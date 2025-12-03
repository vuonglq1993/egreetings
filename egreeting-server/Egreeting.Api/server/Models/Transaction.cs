using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Transaction
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int TemplateId { get; set; }

    public string RecipientEmail { get; set; } = null!;

    public string? Subject { get; set; }

    public string? Message { get; set; }

    public decimal Price { get; set; }

    public string? PaymentMethod { get; set; }

    public string PaymentStatus { get; set; } = null!;

    public DateTime SentAt { get; set; }

    public virtual Template Template { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
