using server.Models;
using server.Repositories.Interfaces;

namespace server.Repositories.Implementations
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(EGreetingDbContext context) : base(context)
        {
        }

    }
}