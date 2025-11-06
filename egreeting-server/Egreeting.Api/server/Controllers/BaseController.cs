using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController<T> : ControllerBase where T : class
    {
        private readonly DbContext _context;
        private readonly DbSet<T> _dbSet;

        public BaseController(DbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        // =========================================
        // ============= BASIC CRUD ================
        // =========================================

        [HttpGet]
        public virtual async Task<ActionResult<IEnumerable<T>>> GetAll()
        {
            var items = await _dbSet.ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public virtual async Task<ActionResult<T>> GetById(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
                return NotFound();
            return Ok(entity);
        }

        [HttpPost]
        public virtual async Task<ActionResult<T>> Create([FromBody] T entity)
        {
            _dbSet.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = GetEntityId(entity) }, entity);
        }

        [HttpPut("{id}")]
        public virtual async Task<IActionResult> Update(int id, [FromBody] T entity)
        {
            var existing = await _dbSet.FindAsync(id);
            if (existing == null)
                return NotFound();

            _context.Entry(existing).CurrentValues.SetValues(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> Delete(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
                return NotFound();

            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // =========================================
        // =========== ADVANCED FILTER =============
        // =========================================

        [HttpGet("filter")]
        public virtual async Task<ActionResult<IEnumerable<T>>> Filter(
            [FromQuery] string? search = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] bool desc = false,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            IQueryable<T> query = _dbSet.AsQueryable();

            // Search by any string property
            if (!string.IsNullOrEmpty(search))
            {
                var parameter = Expression.Parameter(typeof(T), "x");
                var stringProps = typeof(T).GetProperties()
                    .Where(p => p.PropertyType == typeof(string))
                    .ToList();

                Expression? filterExpression = null;

                foreach (var prop in stringProps)
                {
                    var propAccess = Expression.Property(parameter, prop);
                    var searchConst = Expression.Constant(search);
                    var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) })!;
                    var containsExpr = Expression.Call(propAccess, containsMethod, searchConst);

                    filterExpression = filterExpression == null
                        ? (Expression)containsExpr
                        : Expression.OrElse(filterExpression, containsExpr);
                }

                if (filterExpression != null)
                {
                    var lambda = Expression.Lambda<Func<T, bool>>(filterExpression, parameter);
                    query = query.Where(lambda);
                }
            }

            // Sorting
            if (!string.IsNullOrEmpty(sortBy))
            {
                var property = typeof(T).GetProperty(sortBy,
                    System.Reflection.BindingFlags.IgnoreCase |
                    System.Reflection.BindingFlags.Public |
                    System.Reflection.BindingFlags.Instance);

                if (property != null)
                {
                    var parameter = Expression.Parameter(typeof(T), "x");
                    var propertyAccess = Expression.Property(parameter, property);
                    var orderByExpr = Expression.Lambda(propertyAccess, parameter);

                    string methodName = desc ? "OrderByDescending" : "OrderBy";
                    var resultExpr = Expression.Call(typeof(Queryable), methodName,
                        new Type[] { typeof(T), property.PropertyType },
                        query.Expression, Expression.Quote(orderByExpr));
                    query = query.Provider.CreateQuery<T>(resultExpr);
                }
            }

            // Paging
            var total = await query.CountAsync();
            var data = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return Ok(new
            {
                total,
                page,
                pageSize,
                data
            });
        }

        // =========================================
        // ============== HELPER ===================
        // =========================================
        private object? GetEntityId(T entity)
        {
            var prop = typeof(T).GetProperties()
                .FirstOrDefault(p => p.Name.Equals("Id", StringComparison.OrdinalIgnoreCase));
            return prop?.GetValue(entity);
        }
    }
}
