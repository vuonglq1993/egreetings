using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : BaseController<Feedback>
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
            : base(feedbackService)
        {
            _feedbackService = feedbackService;
        }

        // GET: api/feedback/with-user
        [HttpGet("with-user")]
        public async Task<IActionResult> GetAllWithUser()
        {
            var data = await _feedbackService.GetAllWithUserAsync();
            return Ok(data);
        }

        // GET: api/feedback/with-user/{id}
        [HttpGet("with-user/{id}")]
        public async Task<IActionResult> GetByIdWithUser(int id)
        {
            var item = await _feedbackService.GetByIdWithUserAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // Custom keyword search (search by message or user name)
        [HttpGet("search")]
        public override async Task<IActionResult> Search(
            [FromQuery] string? search = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] bool isDescending = false,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var (items, totalCount) = await _feedbackService.SearchAsync(
                search, sortBy, isDescending, pageNumber, pageSize
            );

            return Ok(new { items, totalCount });
        }
    }
}