using server.Models;

namespace server.Services.Interfaces
{
    public interface IReportService : IBaseService<Report>
    {
        Task<IEnumerable<Report>> GetAllWithRelationsAsync();
        Task<Report?> GetByIdWithRelationsAsync(int id);
    }
}