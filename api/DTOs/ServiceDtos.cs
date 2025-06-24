namespace api.DTOs;

public class ServiceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal UnitPrice { get; set; }
    public string? Recurrence { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ServiceCreateDto
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal UnitPrice { get; set; }
    public string? Recurrence { get; set; }
}

public class ServiceUpdateDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? UnitPrice { get; set; }
    public string? Recurrence { get; set; }
} 