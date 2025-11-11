using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Implementations;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TemplateController : BaseController<Template>
    {
        private readonly TemplateService _service;

        public TemplateController(TemplateService service) : base(service)
        {
            _service = service;
        }

        // ===== Methods with relations =====
        [HttpGet("with-category")]
        public async Task<IActionResult> GetAllWithCategory()
        {
            var data = await _service.GetAllWithCategoryAsync();
            return Ok(data);
        }

        [HttpGet("with-category/{id}")]
        public async Task<IActionResult> GetByIdWithCategory(int id)
        {
            var item = await _service.GetByIdWithCategoryAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // ===== Example search by Title (optional override) =====
        [HttpGet("search-by-title")]
        public async Task<IActionResult> SearchByTitle([FromQuery] string keyword)
        {
            var results = await _service.SearchAsync(keyword, t => t.Title);
            return Ok(results);
        }
    }
}