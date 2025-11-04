using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Feedback
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string Message { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual User? User { get; set; }
}
