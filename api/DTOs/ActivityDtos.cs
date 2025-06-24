namespace api.DTOs;

public class ActivityDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Type { get; set; } = null!;
    public Guid EntityId { get; set; }
    public string EntityName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
} 