using server.DTOs;
using server.Models;

namespace server.Mappers
{
    public static class SubscriptionRecipientMapper
    {
        public static SubscriptionRecipientDTO ToDTO(SubscriptionRecipient rec)
        {
            return new SubscriptionRecipientDTO
            {
                Id = rec.Id,
                SubscriptionId = rec.SubscriptionId,
                RecipientEmail = rec.RecipientEmail,
                SubscriptionUserName = rec.Subscription?.User?.FullName
            };
        }
    }
}