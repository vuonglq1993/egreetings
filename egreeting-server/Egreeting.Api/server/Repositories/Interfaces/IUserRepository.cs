using server.Models;
using System.Linq.Expressions;

namespace server.Repositories.Interfaces
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<IEnumerable<User>> GetAllWithRelationsAsync(
            Expression<Func<User, bool>>? filter = null,
            Func<IQueryable<User>, IOrderedQueryable<User>>? orderBy = null);

        Task<User?> GetByIdWithRelationsAsync(int id);
    }
}