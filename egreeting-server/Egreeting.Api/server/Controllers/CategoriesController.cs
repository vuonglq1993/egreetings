using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Models;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // =============================
        // ========= CRUD ===============
        // =============================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
        {
            var categories = await _categoryService.GetAllAsync();
            var result = categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetById(int id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category == null) return NotFound();

            return Ok(new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            });
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description
            };

            var created = await _categoryService.CreateAsync(category);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, new CategoryDto
            {
                Id = created.Id,
                Name = created.Name,
                Description = created.Description
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
        {
            var existing = await _categoryService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            if (dto.Name != null) existing.Name = dto.Name;
            if (dto.Description != null) existing.Description = dto.Description;

            var success = await _categoryService.UpdateAsync(id, existing);
            if (!success) return BadRequest("Update failed");
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _categoryService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        // =============================
        // ======= FILTER (Optional) ===
        // =============================

        [HttpGet("filter")]
        public async Task<ActionResult> Filter(
            [FromQuery] string? search = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] bool desc = false,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var (data, total) = await _categoryService.FilterAsync(search, sortBy, desc, page, pageSize);

            var result = data.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            });

            return Ok(new
            {
                total,
                page,
                pageSize,
                data = result
            });
        }
    }
}
