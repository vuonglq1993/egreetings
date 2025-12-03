using server.Models;

namespace server.Repositories.Interfaces
{
    public interface IReportRepository : IBaseRepository<Report>
    {
        Task<IEnumerable<Report>> GetAllWithRelationsAsync();
        Task<Report?> GetByIdWithRelationsAsync(int id);
    }
}