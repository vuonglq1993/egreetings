using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class ReportService : BaseService<Report>, IReportService
    {
        private readonly IReportRepository _reportRepository;

        public ReportService(IReportRepository reportRepository) : base(reportRepository)
        {
            _reportRepository = reportRepository;
        }

        public async Task<IEnumerable<Report>> GetAllWithRelationsAsync()
            => await _reportRepository.GetAllWithRelationsAsync();

        public async Task<Report?> GetByIdWithRelationsAsync(int id)
            => await _reportRepository.GetByIdWithRelationsAsync(id);
    }
}