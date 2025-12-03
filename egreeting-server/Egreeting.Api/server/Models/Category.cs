using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<Template> Templates { get; set; } = new List<Template>();
}
