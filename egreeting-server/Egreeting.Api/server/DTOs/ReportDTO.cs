namespace server.DTOs
{
    public class ReportDTO
    {
        public int Id { get; set; }
        public DateOnly ReportDate { get; set; }
        public int TotalTransactions { get; set; }
        public decimal TotalPayments { get; set; }
        public int ActiveSubscriptions { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}