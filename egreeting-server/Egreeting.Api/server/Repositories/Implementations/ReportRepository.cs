using System.Linq.Expressions;
using server.Models;
using Microsoft.EntityFrameworkCore;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class ReportRepository : BaseRepository<Report>, IReportRepository
    {
        public ReportRepository(EGreetingDbContext context) : base(context) { }

        // Nếu cần mở rộng hàm đặc thù, thêm ở đây
    }
}