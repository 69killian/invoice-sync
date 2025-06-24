using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.DTOs;
using api.Models;

namespace api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/user
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
    {
        var users = await _context.Users
            .AsNoTracking()
            .Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                ProfileImageUrl = u.ProfileImageUrl,
                Company = u.Company,
                JobTitle = u.JobTitle,
                Bio = u.Bio,
                CreatedAt = u.CreatedAt
            }).ToListAsync();

        return Ok(users);
    }

    // GET: api/user/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUserById(Guid id)
    {
        var user = await _context.Users
            .AsNoTracking()
            .Where(u => u.Id == id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                ProfileImageUrl = u.ProfileImageUrl,
                Company = u.Company,
                JobTitle = u.JobTitle,
                Bio = u.Bio,
                CreatedAt = u.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (user is null)
            return NotFound();

        return Ok(user);
    }

    // POST: api/user
    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] UserCreateDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return Conflict("Email already exists");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            ProfileImageUrl = dto.ProfileImageUrl,
            Company = dto.Company,
            JobTitle = dto.JobTitle,
            Bio = dto.Bio
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var result = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            ProfileImageUrl = user.ProfileImageUrl,
            Company = user.Company,
            JobTitle = user.JobTitle,
            Bio = user.Bio,
            CreatedAt = user.CreatedAt
        };

        return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, result);
    }

    // PUT: api/user/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserUpdateDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null)
            return NotFound();

        if (dto.ProfileImageUrl is not null)
            user.ProfileImageUrl = dto.ProfileImageUrl;
        if (dto.Company is not null)
            user.Company = dto.Company;
        if (dto.JobTitle is not null)
            user.JobTitle = dto.JobTitle;
        if (dto.Bio is not null)
            user.Bio = dto.Bio;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/user/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null)
            return NotFound();

        // Remove dependent data
        var clients = _context.Clients.Where(c => c.UserId == id);
        var services = _context.Services.Where(s => s.UserId == id);
        var invoices = _context.Invoices.Where(i => i.UserId == id);
        var activities = _context.Activities.Where(a => a.UserId == id);

        _context.InvoiceServices.RemoveRange(_context.InvoiceServices.Where(isvc => invoices.Select(i => i.Id).Contains(isvc.InvoiceId)));
        _context.Invoices.RemoveRange(invoices);
        _context.Services.RemoveRange(services);
        _context.Clients.RemoveRange(clients);
        _context.Activities.RemoveRange(activities);
        _context.Users.Remove(user);

        await _context.SaveChangesAsync();
        return NoContent();
    }
} 