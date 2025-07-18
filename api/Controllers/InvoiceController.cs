using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using api.Documents;
using QuestPDF.Infrastructure;

namespace api.Controllers
{
    [Authorize]
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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var invoices = await _context.Invoices
                .Where(i => i.UserId == Guid.Parse(userId))
                .Include(i => i.Client)
                .Include(i => i.Services)
                    .ThenInclude(s => s.Service)
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
                    DueDate = i.DueDate,
                    Services = i.Services.Select(s => new InvoiceServiceDto
                    {
                        ServiceId = s.ServiceId,
                        ServiceName = s.Service.Name,
                        UnitPrice = s.UnitPrice,
                        Quantity = s.Quantity,
                        Subtotal = s.Subtotal
                    }).ToList()
                })
                .ToListAsync();

            return Ok(invoices);
        }

        // GET: api/invoice/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDto>> GetInvoiceById(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var invoice = await _context.Invoices
                .Include(i => i.Client)
                .Include(i => i.Services)
                    .ThenInclude(s => s.Service)
                .AsNoTracking()
                .Where(i => i.Id == id && i.UserId == Guid.Parse(userId))
                .Select(i => new InvoiceDto
                {
                    Id = i.Id,
                    InvoiceNumber = i.InvoiceNumber,
                    ClientName = i.Client.Name,
                    TotalExclTax = i.TotalExclTax,
                    TotalInclTax = i.TotalInclTax,
                    Status = i.Status,
                    DateIssued = i.DateIssued,
                    DueDate = i.DueDate,
                    Services = i.Services.Select(s => new InvoiceServiceDto
                    {
                        ServiceId = s.ServiceId,
                        ServiceName = s.Service.Name,
                        UnitPrice = s.UnitPrice,
                        Quantity = s.Quantity,
                        Subtotal = s.Subtotal
                    }).ToList()
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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            // Verify client belongs to user
            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == dto.ClientId && c.UserId == Guid.Parse(userId));
            if (client is null)
                return BadRequest("Client not found or not authorized");

            // Verify all services belong to user
            var serviceIds = dto.Services.Select(s => s.ServiceId).ToList();
            var services = await _context.Services
                .Where(s => serviceIds.Contains(s.Id) && s.UserId == Guid.Parse(userId))
                .ToListAsync();

            if (services.Count != serviceIds.Count)
                return BadRequest("One or more services not found or not authorized");

            var invoice = new Invoice
            {
                Id = Guid.NewGuid(),
                UserId = Guid.Parse(userId),
                ClientId = dto.ClientId,
                InvoiceNumber = dto.InvoiceNumber,
                Status = dto.Status,
                DateIssued = dto.DateIssued.ToUniversalTime(),
                DueDate = dto.DueDate?.ToUniversalTime(),
                CreatedAt = DateTime.UtcNow
            };

            // Calculate totals
            decimal totalExclTax = 0;
            var invoiceServices = new List<InvoiceService>();
            foreach (var svc in dto.Services)
            {
                var service = services.First(s => s.Id == svc.ServiceId);
                if (svc.Quantity <= 0)
                {
                    return BadRequest($"Invalid quantity for service {service.Name}: {svc.Quantity}");
                }

                totalExclTax += service.UnitPrice * svc.Quantity;
                invoiceServices.Add(new InvoiceService
                {
                    Id = Guid.NewGuid(),
                    InvoiceId = invoice.Id,
                    ServiceId = svc.ServiceId,
                    Quantity = svc.Quantity,
                    UnitPrice = service.UnitPrice,
                    Subtotal = service.UnitPrice * svc.Quantity
                });
            }

            invoice.TotalExclTax = totalExclTax;
            invoice.TotalInclTax = totalExclTax * 1.2m; // 20% TVA

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
                DueDate = invoice.DueDate,
                Services = invoiceServices.Select(s => new InvoiceServiceDto
                {
                    ServiceId = s.ServiceId,
                    ServiceName = services.First(svc => svc.Id == s.ServiceId).Name,
                    UnitPrice = services.First(svc => svc.Id == s.ServiceId).UnitPrice,
                    Quantity = s.Quantity
                }).ToList()
            };

            return CreatedAtAction(nameof(GetInvoiceById), new { id = invoice.Id }, result);
        }

        // PUT: api/invoice/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(Guid id, [FromBody] InvoiceUpdateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var invoice = await _context.Invoices
                .Include(i => i.Services)
                .FirstOrDefaultAsync(i => i.Id == id && i.UserId == Guid.Parse(userId));

            if (invoice is null)
                return NotFound();

            if (dto.ClientId.HasValue)
            {
                var client = await _context.Clients
                    .FirstOrDefaultAsync(c => c.Id == dto.ClientId && c.UserId == Guid.Parse(userId));
                if (client is null)
                    return BadRequest("Client not found or not authorized");
                invoice.ClientId = dto.ClientId.Value;
            }

            if (dto.Services != null)
            {
                try
                {
                    // Validate service IDs
                    var serviceIds = dto.Services.Select(s => s.ServiceId).ToList();
                    if (!serviceIds.Any())
                    {
                        return BadRequest("At least one service is required");
                    }

                    // Check for invalid service IDs
                    if (serviceIds.Any(id => id == Guid.Empty))
                    {
                        return BadRequest("Invalid service ID found");
                    }

                    // Verify all services belong to user
                    var services = await _context.Services
                        .Where(s => serviceIds.Contains(s.Id) && s.UserId == Guid.Parse(userId))
                        .ToListAsync();

                    if (services.Count != serviceIds.Count)
                    {
                        var foundIds = services.Select(s => s.Id).ToList();
                        var missingIds = serviceIds.Where(id => !foundIds.Contains(id));
                        return BadRequest($"Services not found or not authorized: {string.Join(", ", missingIds)}");
                    }

                    // Remove existing services
                    _context.InvoiceServices.RemoveRange(invoice.Services);

                    // Calculate new totals
                    decimal totalExclTax = 0;
                    var invoiceServices = new List<InvoiceService>();
                    foreach (var svc in dto.Services)
                    {
                        var service = services.First(s => s.Id == svc.ServiceId);
                        if (svc.Quantity <= 0)
                        {
                            return BadRequest($"Invalid quantity for service {service.Name}: {svc.Quantity}");
                        }

                        totalExclTax += service.UnitPrice * svc.Quantity;
                        invoiceServices.Add(new InvoiceService
                        {
                            Id = Guid.NewGuid(),
                            InvoiceId = invoice.Id,
                            ServiceId = svc.ServiceId,
                            Quantity = svc.Quantity,
                            UnitPrice = service.UnitPrice,
                            Subtotal = service.UnitPrice * svc.Quantity
                        });
                    }

                    invoice.TotalExclTax = totalExclTax;
                    invoice.TotalInclTax = totalExclTax * 1.2m; // 20% TVA
                    await _context.InvoiceServices.AddRangeAsync(invoiceServices);
                }
                catch (Exception ex)
                {
                    // Log the error
                    Console.WriteLine($"Error updating invoice services: {ex.Message}");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    return StatusCode(500, "An error occurred while updating invoice services");
                }
            }

            if (dto.InvoiceNumber is not null)
                invoice.InvoiceNumber = dto.InvoiceNumber;
            if (dto.Status is not null)
                invoice.Status = dto.Status;
            if (dto.DateIssued.HasValue)
                invoice.DateIssued = dto.DateIssued.Value.ToUniversalTime();
            if (dto.DueDate.HasValue)
                invoice.DueDate = dto.DueDate.Value.ToUniversalTime();

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/invoice/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var invoice = await _context.Invoices
                .Include(i => i.Services)
                .FirstOrDefaultAsync(i => i.Id == id && i.UserId == Guid.Parse(userId));

            if (invoice is null)
                return NotFound();

            _context.InvoiceServices.RemoveRange(invoice.Services);
            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/invoice/{id}/pdf
        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> GetInvoicePdf(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var invoice = await _context.Invoices
                .Include(i => i.Client)
                .Include(i => i.Services)
                    .ThenInclude(s => s.Service)
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.Id == id && i.UserId == Guid.Parse(userId));

            if (invoice is null)
                return NotFound();

            if (invoice.Client is null || !invoice.Services.Any() || invoice.Services.Any(s => s.Service is null))
            {
                return BadRequest("La facture est incomplète (client ou services manquants)");
            }

            try
            {
                var document = new InvoiceDocument(invoice);
                var pdfBytes = document.GeneratePdf();
                return File(pdfBytes, "application/pdf", $"facture-{invoice.InvoiceNumber}.pdf");
            }
            catch (Exception ex)
            {
                // Log the error
                Console.WriteLine($"Error generating PDF: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, "An error occurred while generating the PDF");
            }
        }
    }
}