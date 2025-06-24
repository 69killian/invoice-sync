namespace api.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string? ProfileImageUrl { get; set; }
    public string? Company { get; set; }
    public string? JobTitle { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UserCreateDto
{
    public string Email { get; set; } = null!;
    public string? ProfileImageUrl { get; set; }
    public string? Company { get; set; }
    public string? JobTitle { get; set; }
    public string? Bio { get; set; }
}

public class UserUpdateDto
{
    public string? ProfileImageUrl { get; set; }
    public string? Company { get; set; }
    public string? JobTitle { get; set; }
    public string? Bio { get; set; }
} 