using server.DTOs;
using server.Models;

namespace server.Mappers
{
    public static class SubscriptionMapper
    {
        public static SubscriptionDTO ToDTO(Subscription sub)
        {
            return new SubscriptionDTO
            {
                Id = sub.Id,
                UserId = sub.UserId,
                PackageId = sub.PackageId,
                IsActive = sub.IsActive,
                PaymentStatus = sub.PaymentStatus,
                CreatedAt = sub.CreatedAt,
                UserName = sub.User?.FullName,
                PackageName = sub.Package?.Name,
                RecipientCount = sub.SubscriptionRecipients?.Count ?? 0
            };
        }
    }
}