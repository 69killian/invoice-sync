using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace api.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ServiceController : ControllerBase
{
    private readonly AppDbContext _context;

    public ServiceController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/service
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAllServices()
    {
        var services = await _context.Services
            .AsNoTracking()
            .Select(s => new ServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                UnitPrice = s.UnitPrice,
                Recurrence = s.Recurrence,
                CreatedAt = s.CreatedAt
            }).ToListAsync();

        return Ok(services);
    }

    // GET: api/service/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceDto>> GetServiceById(Guid id)
    {
        var service = await _context.Services
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new ServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                UnitPrice = s.UnitPrice,
                Recurrence = s.Recurrence,
                CreatedAt = s.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (service is null)
            return NotFound();

        return Ok(service);
    }

    // POST: api/service
    [HttpPost]
    public async Task<ActionResult<ServiceDto>> CreateService([FromBody] ServiceCreateDto dto)
    {
        // Derive userId from JWT claims if not provided
        Guid userId;
        if (dto.UserId != Guid.Empty)
        {
            userId = dto.UserId;
        }
        else
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (claim is null || !Guid.TryParse(claim, out userId))
                return Unauthorized();
        }

        var user = await _context.Users.FindAsync(userId);
        if (user is null)
            return BadRequest("Invalid userId");

        var service = new Service
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = dto.Name,
            Description = dto.Description,
            UnitPrice = dto.UnitPrice,
            Recurrence = dto.Recurrence
        };

        await _context.Services.AddAsync(service);
        await _context.SaveChangesAsync();

        var result = new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            UnitPrice = service.UnitPrice,
            Recurrence = service.Recurrence,
            CreatedAt = service.CreatedAt
        };

        return CreatedAtAction(nameof(GetServiceById), new { id = service.Id }, result);
    }

    // PUT: api/service/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateService(Guid id, [FromBody] ServiceUpdateDto dto)
    {
        var service = await _context.Services.FindAsync(id);
        if (service is null)
            return NotFound();

        if (dto.Name is not null)
            service.Name = dto.Name;
        if (dto.Description is not null)
            service.Description = dto.Description;
        if (dto.UnitPrice.HasValue)
            service.UnitPrice = dto.UnitPrice.Value;
        if (dto.Recurrence is not null)
            service.Recurrence = dto.Recurrence;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/service/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteService(Guid id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service is null)
            return NotFound();

        var invoiceServices = _context.InvoiceServices.Where(isvc => isvc.ServiceId == id);
        _context.InvoiceServices.RemoveRange(invoiceServices);

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();
        return NoContent();
    }
} 