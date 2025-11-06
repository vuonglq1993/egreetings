using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class FeedbackRepository : BaseRepository<Feedback>, IFeedbackRepository
    {
        private readonly EGreetingDbContext _context;

        public FeedbackRepository(EGreetingDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Feedback>> GetAllWithUsersAsync()
        {
            return await _context.Feedbacks
                .Include(f => f.User)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }
    }
}