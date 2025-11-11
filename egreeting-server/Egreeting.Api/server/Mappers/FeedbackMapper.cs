using server.DTOs;
using server.Models;

namespace server.Mappers
{
    public static class FeedbackMapper
    {
        public static FeedbackDTO ToDTO(Feedback feedback)
        {
            return new FeedbackDTO
            {
                Id = feedback.Id,
                UserId = feedback.UserId,
                Message = feedback.Message,
                CreatedAt = feedback.CreatedAt,
                UserName = feedback.User?.FullName,
                UserEmail = feedback.User?.Email
            };
        }
    }
}