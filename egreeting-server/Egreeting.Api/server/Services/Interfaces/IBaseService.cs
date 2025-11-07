using System.Linq.Expressions;

namespace server.Services
{
    public interface IBaseService<TDto>
    {
        Task<IEnumerable<TDto>> GetAllAsync(
            string? search = null,
            string? sortBy = null,
            bool isDescending = false,
            Expression<Func<TDto, bool>>? filter = null
        );

        Task<TDto?> GetByIdAsync(int id);

        Task<TDto> CreateAsync(TDto dto);

        Task UpdateAsync(int id, TDto dto);

        Task DeleteAsync(int id);
    }
}