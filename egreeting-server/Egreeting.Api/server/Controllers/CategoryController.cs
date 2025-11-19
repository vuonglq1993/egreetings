using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;
using server.DTOs;

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

        // Full categories với templates
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
            if (data == null) return NotFound();
            return Ok(data);
        }

        // Categories DTO với TemplateCount
        [HttpGet("with-template-count")]
        public async Task<IActionResult> GetAllWithTemplateCount()
        {
            var data = await _categoryService.GetAllWithTemplateCountAsync();
            return Ok(data);
        }

        [HttpGet("{id}/with-template-count")]
        public async Task<IActionResult> GetByIdWithTemplateCount(int id)
        {
            var data = await _categoryService.GetByIdWithTemplateCountAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }
		
		[HttpGet("{name}/templates")]
		public async Task<IActionResult> GetTemplatesByName(string name)
		{
    		var categories = await _categoryService.GetAllWithTemplatesAsync();
    		var category = categories.FirstOrDefault(c => 
        	string.Equals(c.Name, name, StringComparison.OrdinalIgnoreCase));

    		if (category == null)
        	return NotFound($"Category '{name}' not found");

    		return Ok(category.Templates);
		}
    }
}