using server.Models;

namespace server.Services.Interfaces
{
    public interface IFeedbackService : IBaseService<Feedback>
    {
        Task<IEnumerable<Feedback>> GetAllWithUserAsync();
        Task<Feedback?> GetByIdWithUserAsync(int id);
    }
}