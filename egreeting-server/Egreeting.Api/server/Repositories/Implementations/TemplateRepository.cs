using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories.Interfaces;
using System.Linq.Expressions;

namespace server.Repositories.Implementations
{
    public class TemplateRepository : BaseRepository<Template>, ITemplateRepository
    {
        private readonly EGreetingDbContext _context;

        public TemplateRepository(EGreetingDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Template>> GetAllWithRelationsAsync(
            Expression<Func<Template, bool>>? filter = null,
            Func<IQueryable<Template>, IOrderedQueryable<Template>>? orderBy = null)
        {
            IQueryable<Template> query = _dbSet
                .Include(t => t.Category)
                .Include(t => t.Transactions);

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null)
                query = orderBy(query);

            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<Template?> GetByIdWithRelationsAsync(int id)
        {
            return await _dbSet
                .Include(t => t.Category)
                .Include(t => t.Transactions)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }


        public async Task<(IEnumerable<Template> items, int totalCount)> SearchWithRelationsAsync(
            string? search,
            string? sortBy,
            bool isDescending,
            int pageNumber,
            int pageSize)
        {
            var query = _context.Templates
                .Include(t => t.Category)
                .Include(t => t.Transactions)
                .Where(t => t.IsActive)
                .AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();
                query = query.Where(t =>
                    t.Title.ToLower().Contains(search) ||
                    (t.Category != null && t.Category.Name.ToLower().Contains(search))
                );
            }

            // Count
            var totalCount = await query.CountAsync();

            // Sort
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                query = sortBy.ToLower() switch
                {
                    "price"          => isDescending ? query.OrderByDescending(t => t.Price) : query.OrderBy(t => t.Price),
                    "createdat"      => isDescending ? query.OrderByDescending(t => t.CreatedAt) : query.OrderBy(t => t.CreatedAt),
                    "title"          => isDescending ? query.OrderByDescending(t => t.Title) : query.OrderBy(t => t.Title),
                    "transactioncount" => isDescending
                        ? query.OrderByDescending(t => t.Transactions.Count)
                        : query.OrderBy(t => t.Transactions.Count),
                    _ => isDescending ? query.OrderByDescending(t => t.Id) : query.OrderBy(t => t.Id)
                };
            }

            // Paging
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}
