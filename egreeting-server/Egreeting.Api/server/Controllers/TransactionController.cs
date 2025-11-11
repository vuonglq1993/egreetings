using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.Implementations;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : BaseController<Transaction>
    {
        private readonly TransactionService _service;

        public TransactionController(TransactionService service) : base(service)
        {
            _service = service;
        }

        // ===== Include related User + Template =====
        [HttpGet("with-relations")]
        public async Task<IActionResult> GetAllWithRelations()
        {
            var transactions = await _service.GetAllWithRelationsAsync();
            return Ok(transactions);
        }

        [HttpGet("with-relations/{id}")]
        public async Task<IActionResult> GetByIdWithRelations(int id)
        {
            var transaction = await _service.GetByIdWithRelationsAsync(id);
            if (transaction == null) return NotFound();
            return Ok(transaction);
        }
    }
}