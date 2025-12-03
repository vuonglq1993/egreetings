using System.Linq.Expressions;
using server.Models;

namespace server.Repositories.Interfaces
{
    public interface IUserRepository : IBaseRepository<User>
    {
        // Lấy tất cả user kèm quan hệ (feedbacks, subscriptions, transactions)
        Task<IEnumerable<User>> GetAllWithRelationsAsync(
            Expression<Func<User, bool>>? filter = null,
            Func<IQueryable<User>, IOrderedQueryable<User>>? orderBy = null
        );

        // Lấy 1 user theo id kèm quan hệ
        Task<User?> GetByIdWithRelationsAsync(int id);

        // Kiểm tra email có tồn tại không
        Task<bool> CheckEmailExistsAsync(string email);

        // Lấy user theo email
        Task<User?> GetByEmailAsync(string email);

        // Xóa user theo id
        Task DeleteAsync(int id);
    }
}
