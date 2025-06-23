using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // DbSets (à compléter)
    public DbSet<User> Users => Set<User>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceService> InvoiceServices => Set<InvoiceService>();
    public DbSet<Activity> Activities => Set<Activity>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        builder.Entity<Client>()
            .HasOne(c => c.User)
            .WithMany(u => u.Clients)
            .HasForeignKey(c => c.UserId);

        builder.Entity<Service>()
            .HasOne(s => s.User)
            .WithMany(u => u.Services)
            .HasForeignKey(s => s.UserId);

        builder.Entity<Invoice>()
            .HasOne(i => i.User)
            .WithMany(u => u.Invoices)
            .HasForeignKey(i => i.UserId);

        builder.Entity<Invoice>()
            .HasOne(i => i.Client)
            .WithMany(c => c.Invoices)
            .HasForeignKey(i => i.ClientId);

        builder.Entity<InvoiceService>()
            .HasOne(isvc => isvc.Invoice)
            .WithMany(i => i.InvoiceServices)
            .HasForeignKey(isvc => isvc.InvoiceId);

        builder.Entity<InvoiceService>()
            .HasOne(isvc => isvc.Service)
            .WithMany(s => s.InvoiceServices)
            .HasForeignKey(isvc => isvc.ServiceId);

        builder.Entity<Activity>()
            .HasOne(a => a.User)
            .WithMany(u => u.Activities)
            .HasForeignKey(a => a.UserId);

        // Computed columns (Postgres generated) examples
        builder.Entity<Client>()
            .Property(c => c.TotalRevenue)
            .HasComputedColumnSql("(0)", stored: true);

        builder.Entity<Client>()
            .Property(c => c.ProjectsCount)
            .HasComputedColumnSql("(0)", stored: true);

        builder.Entity<InvoiceService>()
            .Property(i => i.Subtotal)
            .HasComputedColumnSql("(\"Quantity\" * \"UnitPrice\")", stored: true);

        //        builder.Entity<Invoice>()
        //            .Property(i => i.TotalExclTax)
        //            .HasComputedColumnSql("(SELECT COALESCE(SUM(\"Subtotal\"),0) FROM \"InvoiceServices\" WHERE \"InvoiceId\" = \"Id\")", stored: true);

        //        builder.Entity<Invoice>()
        //            .Property(i => i.TotalInclTax)
        //            .HasComputedColumnSql("(\"TotalExclTax\" * 1.2)", stored: true);
    }
} 