using server.DTOs;
using server.Models;

namespace server.Mappers
{
    public static class FeedbackMapper
    {
        public static FeedbackDTO ToDTO(this Feedback feedback)
        {
            return new FeedbackDTO
            {
                Id = feedback.Id,
                Message = feedback.Message,
                CreatedAt = feedback.CreatedAt,
                UserName = feedback.User?.FullName
            };
        }

        public static Feedback ToEntity(this CreateFeedbackDTO dto)
        {
            return new Feedback
            {
                UserId = dto.UserId,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };
        }

        public static void UpdateEntity(this Feedback feedback, UpdateFeedbackDTO dto)
        {
            feedback.Message = dto.Message;
        }
    }
}