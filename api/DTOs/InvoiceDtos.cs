namespace api.DTOs;

public class InvoiceDto
{
    public Guid Id { get; set; }
    public string InvoiceNumber { get; set; } = null!;
    public string ClientName { get; set; } = null!;
    public decimal TotalExclTax { get; set; }
    public decimal TotalInclTax { get; set; }
    public string Status { get; set; } = null!;
    public DateTime DateIssued { get; set; }
    public DateTime? DueDate { get; set; }
}

public class InvoiceServiceItemDto
{
    public Guid ServiceId { get; set; }
    public int Quantity { get; set; } = 1;
}

public class InvoiceCreateDto
{
    public string InvoiceNumber { get; set; } = null!;
    public Guid ClientId { get; set; }
    public DateTime DateIssued { get; set; } = DateTime.UtcNow;
    public DateTime? DueDate { get; set; }
    public List<InvoiceServiceItemDto> Services { get; set; } = new();
}

public class InvoiceUpdateDto
{
    public string? InvoiceNumber { get; set; }
    public Guid? ClientId { get; set; }
    public DateTime? DateIssued { get; set; }
    public DateTime? DueDate { get; set; }
    public string? Status { get; set; }
    public List<InvoiceServiceItemDto>? Services { get; set; }
} 