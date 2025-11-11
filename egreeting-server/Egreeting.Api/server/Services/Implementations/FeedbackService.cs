using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class FeedbackService : BaseService<Feedback>, IFeedbackService
    {
        private readonly IFeedbackRepository _feedbackRepository;

        public FeedbackService(IFeedbackRepository feedbackRepository)
            : base(feedbackRepository)
        {
            _feedbackRepository = feedbackRepository;
        }

        public async Task<IEnumerable<Feedback>> GetAllWithUserAsync()
        {
            return await _feedbackRepository.GetAllWithUserAsync();
        }

        public async Task<Feedback?> GetByIdWithUserAsync(int id)
        {
            return await _feedbackRepository.GetByIdWithUserAsync(id);
        }
    }
}