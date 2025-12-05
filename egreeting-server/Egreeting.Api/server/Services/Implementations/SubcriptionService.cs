using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;
using server.DTOs;

namespace server.Services.Implementations
{
    public class SubscriptionService : BaseService<Subscription>, ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;

        public SubscriptionService(ISubscriptionRepository subscriptionRepository)
            : base(subscriptionRepository)
        {
            _subscriptionRepository = subscriptionRepository;
        }

        public async Task<IEnumerable<Subscription>> GetAllWithRelationsAsync()
            => await _subscriptionRepository.GetAllWithRelationsAsync();

        public async Task<Subscription?> GetByIdWithRelationsAsync(int id)
            => await _subscriptionRepository.GetByIdWithRelationsAsync(id);

        public async Task<Subscription?> GetActiveSubscriptionForUserAsync(int userId)
            => await _subscriptionRepository.GetActiveSubscriptionForUserAsync(userId);


        // -------------------------------------------------------------
        // Combined subscription summary (total days from all packages)
        // -------------------------------------------------------------
        public async Task<SubscriptionSummaryDto?> GetUserSubscriptionSummaryAsync(int userId)
        {
            var subs = await _subscriptionRepository.GetAllSubscriptionsForUserAsync(userId);

            if (subs == null || !subs.Any()) return null;

            subs = subs
            .OrderBy(s => s.StartDate)
            .Where(s => s.PaymentStatus == "Completed")
            .ToList();

            var firstStart = subs.First().StartDate;

            int totalDays = subs.Sum(s =>
                (s.EndDate.ToDateTime(TimeOnly.MinValue) -
                 s.StartDate.ToDateTime(TimeOnly.MinValue)).Days
            );

            var finalEnd = firstStart.AddDays(totalDays);
            
          decimal totalPrice = subs.Sum(s => s.Package?.Price ?? 0);

            return new SubscriptionSummaryDto
            {
                PackageName = "Combined Subscription",
                StartDate = firstStart,
                EndDate = finalEnd,
                TotalDays = totalDays,
                TotalPrice = totalPrice,
                IsExpired = finalEnd.ToDateTime(TimeOnly.MinValue) < DateTime.Now
            };
        }
    }
}
