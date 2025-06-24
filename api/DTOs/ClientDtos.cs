namespace api.DTOs;

public class ClientDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Status { get; set; } = null!;
    public decimal TotalRevenue { get; set; }
    public int ProjectsCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ClientCreateDto
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
}

public class ClientUpdateDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Status { get; set; }
} 