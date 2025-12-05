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
            var data = await _service.GetAllWithRelationsAsync();
            return Ok(data);
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