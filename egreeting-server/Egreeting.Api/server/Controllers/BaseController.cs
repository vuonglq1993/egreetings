using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController<T> : ControllerBase where T : class
    {
        protected readonly BaseService<T> _service;

        public BaseController(BaseService<T> service)
        {
            _service = service;
        }

        // ===== CRUD =====
        [HttpGet]
        public virtual async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public virtual async Task<IActionResult> GetById(int id)
        {
            var entity = await _service.GetByIdAsync(id);
            return entity == null ? NotFound() : Ok(entity);
        }

        [HttpPost]
        public virtual async Task<IActionResult> Create([FromBody] T entity)
        {
            await _service.AddAsync(entity);
            return Ok(entity);
        }

        [HttpPut("{id}")]
        public virtual async Task<IActionResult> Update(int id, [FromBody] T entity)
        {
            var result = await _service.UpdateAsync(entity);
            return result ? Ok(entity) : NotFound();
        }

        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return result ? NoContent() : NotFound();
        }

        // ===== Filter (with sort + paging) =====
        [HttpGet("filter")]
        public virtual async Task<IActionResult> Filter(
            [FromQuery] string? sortField,
            [FromQuery] string? sortOrder = "asc",
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _service.FilterAsync(
                predicate: null,
                sortField: sortField,
                sortOrder: sortOrder,
                pageNumber: pageNumber,
                pageSize: pageSize
            );

            return Ok(result);
        }

        // ===== Search =====
        [HttpGet("search")]
        public virtual async Task<IActionResult> Search(
            [FromQuery] string keyword)
        {
            // Override this method in derived controllers to specify fields
            return BadRequest("Search fields not specified. Override Search() in derived controller.");
        }
    }
}
