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
        var packages = await _packageService.GetAllWithRelationsAsync();

        // Chỉ chọn những trường cần gửi về frontend
        var result = packages.Select(p => new
        {
            p.Id,
            p.Name,
            p.DurationMonths,
            p.Price,
            p.IsActive
        });

        return Ok(result);
    }

    [HttpGet("{id}/with-relations")]
    public async Task<IActionResult> GetByIdWithRelations(int id)
    {
        var package = await _packageService.GetByIdWithRelationsAsync(id);
        if (package == null) return NotFound();
        return Ok(package);
    }
}

}