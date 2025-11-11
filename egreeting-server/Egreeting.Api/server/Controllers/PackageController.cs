using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Implementations;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : BaseController<Package>
    {
        private readonly PackageService _service;

        public PackageController(PackageService service) : base(service)
        {
            _service = service;
        }

        // 🔍 Search theo keyword (Name, Description)
        [HttpGet("search-by-keyword")]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            var results = await _service.SearchPackagesAsync(keyword);
            return Ok(results);
        }

        // 🔍 Search có phân trang (optional)
        [HttpGet("advanced-search")]
        public async Task<IActionResult> AdvancedSearch(
            [FromQuery] string? search = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] bool isDescending = false,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var (items, totalCount) = await _service.SearchAsync(search, sortBy, isDescending, pageNumber, pageSize);
            return Ok(new { items, totalCount });
        }
    }
}