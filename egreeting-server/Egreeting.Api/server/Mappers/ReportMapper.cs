using server.DTOs;
using server.Models;

namespace server.Mappers
{
    public static class ReportMapper
    {
        public static ReportDTO ToDTO(Report report)
        {
            return new ReportDTO
            {
                Id = report.Id,
                ReportDate = report.ReportDate,
                TotalTransactions = report.TotalTransactions,
                TotalPayments = report.TotalPayments,
                ActiveSubscriptions = report.ActiveSubscriptions,
                CreatedAt = report.CreatedAt
            };
        }
    }
}