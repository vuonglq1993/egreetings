using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class ReportService : BaseService<Report>, IReportService
    {
        private readonly IReportRepository _reportRepository;

        public ReportService(IReportRepository reportRepository)
            : base(reportRepository)
        {
            _reportRepository = reportRepository;
        }

        // Nếu cần các hàm đặc thù, ví dụ báo cáo tổng hợp, thêm ở đây
    }
}