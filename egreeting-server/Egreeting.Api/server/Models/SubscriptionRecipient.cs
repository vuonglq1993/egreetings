using System;
using System.Collections.Generic;

namespace server.Models;

public partial class SubscriptionRecipient
{
    public int Id { get; set; }

    public int SubscriptionId { get; set; }

    public string RecipientEmail { get; set; } = null!;

    public virtual Subscription Subscription { get; set; } = null!;
}
