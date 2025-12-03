using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Interfaces;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : BaseController<Transaction>
    {
        private readonly ITransactionService _service;

        public TransactionController(ITransactionService service) : base(service)
        {
            _service = service;
        }

        // GET: api/transaction/with-relations
        [HttpGet("with-relations")]
        public async Task<IActionResult> GetAllWithRelations()
        {
            var transactions = await _service.GetAllWithRelationsAsync();

            // Map dữ liệu ra JSON mà frontend cần
            var result = transactions.Select(t => new
            {
                t.Id,
                userId = t.UserId,
                templateId = t.TemplateId,
                userName = t.User != null ? t.User.FullName : "",
                templateTitle = t.Template != null ? t.Template.Title : "",
                t.RecipientEmail,
                t.Subject,
                t.Message,
                t.Price,
                t.PaymentMethod,
                t.PaymentStatus,
                t.SentAt
            });

            return Ok(result);
        }


        // GET: api/transaction/5/with-relations
        [HttpGet("{id}/with-relations")]
        public async Task<IActionResult> GetByIdWithRelations(int id)
        {
            var data = await _service.GetByIdWithRelationsAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }
    }
}