using server.Models;
using server.Repositories.Interfaces;
using server.Services.Interfaces;

namespace server.Services.Implementations
{
    public class CategoryService : BaseService<Category>, ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(EGreetingDbContext context, ICategoryRepository categoryRepository)
            : base(context)
        {
            _categoryRepository = categoryRepository;
        }

    }
}