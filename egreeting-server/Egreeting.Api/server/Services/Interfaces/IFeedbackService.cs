using server.DTOs;

namespace server.Services.Interfaces
{
    public interface IFeedbackService
    {
        Task<IEnumerable<FeedbackDTO>> GetAllAsync();
        Task<FeedbackDTO?> GetByIdAsync(int id);
        Task<FeedbackDTO> CreateAsync(CreateFeedbackDTO dto);
        Task<bool> UpdateAsync(int id, UpdateFeedbackDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}