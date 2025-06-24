using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.DTOs;
using api.Models;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoiceController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/invoice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetAllInvoices()
        {
            var invoices = await _context.Invoices
                .Include(i => i.Client)
                .AsNoTracking()
                .Select(i => new InvoiceDto
                {
                    Id = i.Id,
                    InvoiceNumber = i.InvoiceNumber,
                    ClientName = i.Client.Name,
                    TotalExclTax = i.TotalExclTax,
                    TotalInclTax = i.TotalInclTax,
                    Status = i.Status,
                    DateIssued = i.DateIssued,
                    DueDate = i.DueDate
                })
                .ToListAsync();

            return Ok(invoices);
        }

        // GET: api/invoice/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDto>> GetInvoiceById(Guid id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Client)
                .AsNoTracking()
                .Where(i => i.Id == id)
                .Select(i => new InvoiceDto
                {
                    Id = i.Id,
                    InvoiceNumber = i.InvoiceNumber,
                    ClientName = i.Client.Name,
                    TotalExclTax = i.TotalExclTax,
                    TotalInclTax = i.TotalInclTax,
                    Status = i.Status,
                    DateIssued = i.DateIssued,
                    DueDate = i.DueDate
                })
                .FirstOrDefaultAsync();

            if (invoice is null)
                return NotFound();

            return Ok(invoice);
        }

        // POST: api/invoice
        [HttpPost]
        public async Task<ActionResult<InvoiceDto>> CreateInvoice([FromBody] InvoiceCreateDto dto)
        {
            // Validate client
            var client = await _context.Clients.FindAsync(dto.ClientId);
            if (client is null)
                return BadRequest("Invalid clientId");

            var invoice = new Invoice
            {
                Id = Guid.NewGuid(),
                InvoiceNumber = dto.InvoiceNumber,
                ClientId = dto.ClientId,
                UserId = client.UserId, // assuming same owner
                DateIssued = dto.DateIssued,
                DueDate = dto.DueDate,
                Status = "unpaid"
            };

            decimal totalExcl = 0m;
            var invoiceServices = new List<InvoiceService>();

            foreach (var item in dto.Services)
            {
                var service = await _context.Services.FindAsync(item.ServiceId);
                if (service is null)
                    return BadRequest($"Service {item.ServiceId} introuvable");

                var subtotal = service.UnitPrice * item.Quantity;
                totalExcl += subtotal;

                invoiceServices.Add(new InvoiceService
                {
                    Id = Guid.NewGuid(),
                    InvoiceId = invoice.Id,
                    ServiceId = item.ServiceId,
                    Quantity = item.Quantity,
                    UnitPrice = service.UnitPrice
                });
            }

            invoice.TotalExclTax = totalExcl;
            invoice.TotalInclTax = totalExcl * 1.2m; // TVA 20 %
            invoice.InvoiceServices = invoiceServices;

            await _context.Invoices.AddAsync(invoice);
            await _context.InvoiceServices.AddRangeAsync(invoiceServices);
            await _context.SaveChangesAsync();

            var result = new InvoiceDto
            {
                Id = invoice.Id,
                InvoiceNumber = invoice.InvoiceNumber,
                ClientName = client.Name,
                TotalExclTax = invoice.TotalExclTax,
                TotalInclTax = invoice.TotalInclTax,
                Status = invoice.Status,
                DateIssued = invoice.DateIssued,
                DueDate = invoice.DueDate
            };

            return CreatedAtAction(nameof(GetInvoiceById), new { id = invoice.Id }, result);
        }

        // PUT: api/invoice/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(Guid id, [FromBody] InvoiceUpdateDto dto)
        {
            var invoice = await _context.Invoices
                .Include(i => i.InvoiceServices)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice is null)
                return NotFound();

            if (dto.InvoiceNumber is not null)
                invoice.InvoiceNumber = dto.InvoiceNumber;
            if (dto.ClientId.HasValue)
                invoice.ClientId = dto.ClientId.Value;
            if (dto.DateIssued.HasValue)
                invoice.DateIssued = dto.DateIssued.Value;
            if (dto.DueDate.HasValue)
                invoice.DueDate = dto.DueDate.Value;
            if (dto.Status is not null)
                invoice.Status = dto.Status;

            if (dto.Services is not null)
            {
                // Remove existing
                _context.InvoiceServices.RemoveRange(invoice.InvoiceServices);

                decimal totalExcl = 0m;
                var newServices = new List<InvoiceService>();

                foreach (var item in dto.Services)
                {
                    var service = await _context.Services.FindAsync(item.ServiceId);
                    if (service is null)
                        return BadRequest($"Service {item.ServiceId} introuvable");

                    var subtotal = service.UnitPrice * item.Quantity;
                    totalExcl += subtotal;

                    newServices.Add(new InvoiceService
                    {
                        Id = Guid.NewGuid(),
                        InvoiceId = invoice.Id,
                        ServiceId = item.ServiceId,
                        Quantity = item.Quantity,
                        UnitPrice = service.UnitPrice
                    });
                }

                invoice.TotalExclTax = totalExcl;
                invoice.TotalInclTax = totalExcl * 1.2m;
                invoice.InvoiceServices = newServices;
                await _context.InvoiceServices.AddRangeAsync(newServices);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/invoice/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(Guid id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice is null)
                return NotFound();

            var related = _context.InvoiceServices.Where(s => s.InvoiceId == id);
            _context.InvoiceServices.RemoveRange(related);
            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}