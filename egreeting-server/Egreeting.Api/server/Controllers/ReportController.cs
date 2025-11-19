using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : BaseController<Report>
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService) : base(reportService)
        {
            _reportService = reportService;
        }

        // GET: api/report/with-relations
        [HttpGet("with-relations")]
        public async Task<IActionResult> GetAllWithRelations()
        {
            var data = await _reportService.GetAllWithRelationsAsync();
            return Ok(data);
        }

        // GET: api/report/5/with-relations
        [HttpGet("{id}/with-relations")]
        public async Task<IActionResult> GetByIdWithRelations(int id)
        {
            var data = await _reportService.GetByIdWithRelationsAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }
    }
}