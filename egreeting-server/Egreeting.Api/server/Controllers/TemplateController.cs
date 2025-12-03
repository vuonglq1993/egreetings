using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;
using server.DTOs;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TemplateController : BaseController<Template>
    {
        private readonly ITemplateService _templateService;

        public TemplateController(ITemplateService templateService)
            : base(templateService)
        {
            _templateService = templateService;
        }

        // ==========================
        // GET ALL WITH RELATIONS
        // ==========================
        [HttpGet("with-relations")]
        public async Task<IActionResult> GetAllWithRelations()
        {
            var data = await _templateService.GetAllWithRelationsAsync();

            var dtos = data.Select(t => new TemplateDTO
            {
                Id = t.Id,
                CategoryId = t.CategoryId,
                Title = t.Title,
                ImageUrl = t.ImageUrl,
                VideoUrl = t.VideoUrl,
                Price = t.Price,
                IsActive = t.IsActive,
                CreatedAt = t.CreatedAt,
                CategoryName = t.Category?.Name,
                TransactionCount = t.Transactions.Count
            });

            return Ok(dtos);
        }

        // ==========================
        // GET BY ID WITH RELATIONS
        // ==========================
        [HttpGet("{id}/with-relations")]
        public async Task<IActionResult> GetByIdWithRelations(int id)
        {
            var t = await _templateService.GetByIdWithRelationsAsync(id);
            if (t == null) return NotFound();

            var dto = new TemplateDTO
            {
                Id = t.Id,
                CategoryId = t.CategoryId,
                Title = t.Title,
                ImageUrl = t.ImageUrl,
                VideoUrl = t.VideoUrl,
                Price = t.Price,
                IsActive = t.IsActive,
                CreatedAt = t.CreatedAt,
                CategoryName = t.Category?.Name,
                TransactionCount = t.Transactions.Count
            };

            return Ok(dto);
        }

        // ==========================
        // CREATE
        // ==========================
		[HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] TemplateCreateDTO dto)
        {
            var template = new Template
            {
                CategoryId = dto.CategoryId,
                Title = dto.Title,
                ImageUrl = dto.ImageUrl,
                VideoUrl = dto.VideoUrl,
                Price = dto.Price,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _templateService.CreateAsync(template);

            var resultDto = new TemplateDTO
            {
                Id = result.Id,
                CategoryId = result.CategoryId,
                Title = result.Title,
                ImageUrl = result.ImageUrl,
                VideoUrl = result.VideoUrl,
                Price = result.Price,
                IsActive = result.IsActive,
                CreatedAt = result.CreatedAt,
                CategoryName = result.Category?.Name,
                TransactionCount = result.Transactions.Count
            };

            return Ok(resultDto);
        }

        // ==========================
        // UPDATE
        [HttpPut("{id}/update")]
        public  async Task<IActionResult> Update(int id, [FromBody] TemplateCreateDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var template = await _templateService.GetByIdAsync(id);
            if (template == null) return NotFound();

            template.CategoryId = dto.CategoryId;
            template.Title = dto.Title;
            template.ImageUrl = dto.ImageUrl;
            template.VideoUrl = dto.VideoUrl;
            template.Price = dto.Price;
            template.IsActive = dto.IsActive;

            await _templateService.UpdateAsync(id, template);

            return NoContent();
        }
        // ==========================
        // DELETE
        // ==========================
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _templateService.DeleteAsync(id);
            return NoContent();
        }

        // ==========================
        // OVERRIDE SEARCH
        // ==========================
        [HttpGet("search")]
        public override async Task<IActionResult> Search(
            string? search = null,
            string? sortBy = null,
            bool isDescending = false,
            int pageNumber = 1,
            int pageSize = 10)
        {
            var (templates, totalCount) =
                await _templateService.SearchWithRelationsAsync(search, sortBy, isDescending, pageNumber, pageSize);

            var dtos = templates.Select(t => new TemplateDTO
            {
                Id = t.Id,
                CategoryId = t.CategoryId,
                Title = t.Title,
                ImageUrl = t.ImageUrl,
                VideoUrl = t.VideoUrl,
                Price = t.Price,
                IsActive = t.IsActive,
                CreatedAt = t.CreatedAt,
                CategoryName = t.Category?.Name,
                TransactionCount = t.Transactions.Count
            });

            return Ok(new { items = dtos, totalCount });
        }
    }
}
