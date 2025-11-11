using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : BaseController<Category>
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
            : base(categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("with-templates")]
        public async Task<IActionResult> GetAllWithTemplates()
        {
            var data = await _categoryService.GetAllWithTemplatesAsync();
            return Ok(data);
        }

        [HttpGet("{id}/with-templates")]
        public async Task<IActionResult> GetByIdWithTemplates(int id)
        {
            var data = await _categoryService.GetByIdWithTemplatesAsync(id);
            if (data == null)
                return NotFound();

            return Ok(data);
        }
    }
}