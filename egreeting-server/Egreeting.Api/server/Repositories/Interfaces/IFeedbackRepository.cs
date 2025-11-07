using server.Models;

namespace server.Repositories.Interfaces
{
    public interface IFeedbackRepository : IBaseRepository<Feedback>
    {
        Task<IEnumerable<Feedback>> GetAllWithUserAsync();
        Task<Feedback?> GetByIdWithUserAsync(int id);
    }
}