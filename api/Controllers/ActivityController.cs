using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers;

[Route("api/[controller]")]
[ApiController]
[AllowAnonymous]
public class ActivityController : ControllerBase
{
    private readonly AppDbContext _context;

    public ActivityController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/activity?userId=...
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ActivityDto>>> GetActivities([FromQuery] Guid? userId = null, int take = 50, int skip = 0)
    {
        var query = _context.Activities.AsNoTracking();
        if (userId.HasValue)
            query = query.Where(a => a.UserId == userId.Value);

        var activities = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip(skip)
            .Take(take)
            .Select(a => new ActivityDto
            {
                Id = a.Id,
                UserId = a.UserId,
                Type = a.Type,
                EntityId = a.EntityId,
                EntityName = a.EntityName,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();

        return Ok(activities);
    }

    // GET: api/activity/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ActivityDto>> GetActivityById(Guid id)
    {
        var activity = await _context.Activities
            .AsNoTracking()
            .Where(a => a.Id == id)
            .Select(a => new ActivityDto
            {
                Id = a.Id,
                UserId = a.UserId,
                Type = a.Type,
                EntityId = a.EntityId,
                EntityName = a.EntityName,
                CreatedAt = a.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (activity is null)
            return NotFound();

        return Ok(activity);
    }
} 