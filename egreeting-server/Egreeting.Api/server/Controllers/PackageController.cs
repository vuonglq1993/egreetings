using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackageController : BaseController<Package>
    {
        private readonly IPackageService _packageService;

        public PackageController(IPackageService packageService) : base(packageService)
        {
            _packageService = packageService;
        }

        [HttpGet("with-relations")]
        public async Task<IActionResult> GetAllWithRelations()
        {
            var data = await _packageService.GetAllWithRelationsAsync();
            return Ok(data);
        }

        [HttpGet("{id}/with-relations")]
        public async Task<IActionResult> GetByIdWithRelations(int id)
        {
            var data = await _packageService.GetByIdWithRelationsAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }
        
    }
}