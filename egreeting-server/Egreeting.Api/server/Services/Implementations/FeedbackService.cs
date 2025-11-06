using server.DTOs;
using server.Mappers;
using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IFeedbackRepository _repository;

        public FeedbackService(IFeedbackRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<FeedbackDTO>> GetAllAsync()
        {
            var feedbacks = await _repository.GetAllWithUsersAsync();
            return feedbacks.Select(f => f.ToDTO());
        }

        public async Task<FeedbackDTO?> GetByIdAsync(int id)
        {
            var feedback = await _repository.GetByIdAsync(id);
            return feedback?.ToDTO();
        }

        public async Task<FeedbackDTO> CreateAsync(CreateFeedbackDTO dto)
        {
            var entity = dto.ToEntity();
            await _repository.AddAsync(entity);
            return entity.ToDTO();
        }

        public async Task<bool> UpdateAsync(int id, UpdateFeedbackDTO dto)
        {
            var feedback = await _repository.GetByIdAsync(id);
            if (feedback == null) return false;

            feedback.UpdateEntity(dto);
            return await _repository.UpdateAsync(feedback);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}