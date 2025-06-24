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
    public List<InvoiceServiceDto> Services { get; set; } = new();
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
    public string Status { get; set; } = "en attente";
    public DateTime DateIssued { get; set; }
    public DateTime? DueDate { get; set; }
    public List<InvoiceServiceCreateDto> Services { get; set; } = new();
}

public class InvoiceUpdateDto
{
    public string? InvoiceNumber { get; set; }
    public Guid? ClientId { get; set; }
    public string? Status { get; set; }
    public DateTime? DateIssued { get; set; }
    public DateTime? DueDate { get; set; }
    public List<InvoiceServiceCreateDto>? Services { get; set; }
}

public class InvoiceServiceDto
{
    public Guid ServiceId { get; set; }
    public string ServiceName { get; set; } = null!;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }
}

public class InvoiceServiceCreateDto
{
    public Guid ServiceId { get; set; }
    public int Quantity { get; set; }
} 