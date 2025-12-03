using server.DTOs;
using server.Models;

namespace server.Mappers
{
    public static class TransactionMapper
    {
        public static TransactionDTO ToDTO(Transaction t)
        {
            return new TransactionDTO
            {
                Id = t.Id,
                UserId = t.UserId,
                TemplateId = t.TemplateId,
                RecipientEmail = t.RecipientEmail,
                Subject = t.Subject,
                Price = t.Price,
                PaymentMethod = t.PaymentMethod,
                PaymentStatus = t.PaymentStatus,
                SentAt = t.SentAt,
                UserName = t.User?.FullName,
                TemplateTitle = t.Template?.Title
            };
        }
    }
}