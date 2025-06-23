using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

public class User
{
    [Key]
    public Guid Id { get; set; }

    [Required, EmailAddress]
    public string Email { get; set; } = null!;

    public string? ProfileImageUrl { get; set; }
    public string? Company { get; set; }
    public string? JobTitle { get; set; }
    public string? Bio { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Client> Clients { get; set; } = new List<Client>();
    public ICollection<Service> Services { get; set; } = new List<Service>();
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    public ICollection<Activity> Activities { get; set; } = new List<Activity>();
}

public class Client
{
    [Key]
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    [Required]
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Status { get; set; } = "active";

    // Calculated columns (generated always as) – Postgres syntax
    [Column(TypeName="numeric")]
    public decimal TotalRevenue { get; private set; }

    public int ProjectsCount { get; private set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}

public class Service
{
    [Key]
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    [Required]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    [Column(TypeName="numeric")]
    public decimal UnitPrice { get; set; }

    public string? Recurrence { get; set; } // null = non récurrent

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public ICollection<InvoiceService> InvoiceServices { get; set; } = new List<InvoiceService>();
}

public class Invoice
{
    [Key]
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    [Required]
    public string InvoiceNumber { get; set; } = null!;

    public Guid ClientId { get; set; }
    public DateTime DateIssued { get; set; }
    public DateTime? DueDate { get; set; }
    public string Status { get; set; } = "unpaid";

    [Column(TypeName="numeric")]
    public decimal TotalExclTax { get; private set; }
    [Column(TypeName="numeric")]
    public decimal TotalInclTax { get; private set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public Client? Client { get; set; }
    public ICollection<InvoiceService> InvoiceServices { get; set; } = new List<InvoiceService>();
}

public class InvoiceService
{
    [Key]
    public Guid Id { get; set; }
    public Guid InvoiceId { get; set; }
    public Guid ServiceId { get; set; }

    public int Quantity { get; set; }
    [Column(TypeName="numeric")]
    public decimal UnitPrice { get; set; }
    [Column(TypeName="numeric")]
    public decimal Subtotal { get; private set; }

    public Invoice? Invoice { get; set; }
    public Service? Service { get; set; }
}

public class Activity
{
    [Key]
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public string Type { get; set; } = null!; // e.g. invoice_created
    public Guid EntityId { get; set; }
    public string EntityName { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
} 