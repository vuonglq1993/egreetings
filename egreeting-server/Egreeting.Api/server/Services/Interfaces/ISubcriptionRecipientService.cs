using server.Models;
using System.Collections.Generic;

namespace server.Services.Interfaces
{
    public interface ISubscriptionRecipientService : IBaseService<SubscriptionRecipient>
    {
        Task<IEnumerable<SubscriptionRecipient>> GetAllWithRelationsAsync();
        Task<SubscriptionRecipient?> GetByIdWithRelationsAsync(int id);
    }
}