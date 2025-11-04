using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Report
{
    public int Id { get; set; }

    public DateOnly ReportDate { get; set; }

    public int TotalTransactions { get; set; }

    public decimal TotalPayments { get; set; }

    public int ActiveSubscriptions { get; set; }

    public DateTime CreatedAt { get; set; }
}
