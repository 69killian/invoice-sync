using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace api.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ClientController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClientController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/client
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClientDto>>> GetAllClients()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var clients = await _context.Clients
            .Where(c => c.UserId == userId)
            .AsNoTracking()
            .Select(c => new ClientDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone,
                Status = c.Status,
                TotalRevenue = c.TotalRevenue,
                ProjectsCount = c.ProjectsCount,
                CreatedAt = c.CreatedAt
            }).ToListAsync();

        return Ok(clients);
    }

    // GET: api/client/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ClientDto>> GetClientById(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var client = await _context.Clients
            .AsNoTracking()
            .Where(c => c.Id == id && c.UserId == userId)
            .Select(c => new ClientDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone,
                Status = c.Status,
                TotalRevenue = c.TotalRevenue,
                ProjectsCount = c.ProjectsCount,
                CreatedAt = c.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (client is null)
            return NotFound();

        return Ok(client);
    }

    // POST: api/client
    [HttpPost]
    public async Task<ActionResult<ClientDto>> CreateClient([FromBody] ClientCreateDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var client = new Client
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Status = "active"
        };

        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();

        var result = new ClientDto
        {
            Id = client.Id,
            Name = client.Name,
            Email = client.Email,
            Phone = client.Phone,
            Status = client.Status,
            TotalRevenue = client.TotalRevenue,
            ProjectsCount = client.ProjectsCount,
            CreatedAt = client.CreatedAt
        };

        return CreatedAtAction(nameof(GetClientById), new { id = client.Id }, result);
    }

    // PUT: api/client/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClient(Guid id, [FromBody] ClientUpdateDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (client is null)
            return NotFound();

        if (dto.Name is not null)
            client.Name = dto.Name;
        if (dto.Email is not null)
            client.Email = dto.Email;
        if (dto.Phone is not null)
            client.Phone = dto.Phone;
        if (dto.Status is not null)
            client.Status = dto.Status;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/client/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClient(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (client is null)
            return NotFound();

        // Cascade delete will remove invoices if FK cascade is set; otherwise manual
        var invoices = _context.Invoices.Where(i => i.ClientId == id);
        _context.Invoices.RemoveRange(invoices);

        _context.Clients.Remove(client);
        await _context.SaveChangesAsync();
        return NoContent();
    }
} 