using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Implementations;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : BaseController<Report>
    {
        public ReportController(ReportService service) : base(service) { }
    }
}