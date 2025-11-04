using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Subscription
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int PackageId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public bool IsActive { get; set; }

    public string PaymentStatus { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Package Package { get; set; } = null!;

    public virtual ICollection<SubscriptionRecipient> SubscriptionRecipients { get; set; } = new List<SubscriptionRecipient>();

    public virtual User? User { get; set; }
}
