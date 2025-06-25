using api.Data;
using Microsoft.EntityFrameworkCore;
using api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.CookiePolicy;

var builder = WebApplication.CreateBuilder(args);

// Configure port for Railway
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

try
{
    var logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Starting application...");
    logger.LogInformation($"Environment: {builder.Environment.EnvironmentName}");
    
    // Log connection string (masked)
    var connString = builder.Configuration.GetConnectionString("DefaultConnection");
    logger.LogInformation($"Database connection configured: {(connString != null ? "Yes" : "No")}");

    // Add DbContext
    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? 
            builder.Configuration.GetConnectionString("DefaultConnection");
        
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Database connection string is not configured. Please set the DATABASE_URL environment variable.");
        }
        options.UseNpgsql(connectionString);
    });

    // Configure CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowNetlify", policy =>
        {
            policy
                .WithOrigins("https://quiet-semifreddo-0c263c.netlify.app")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
    });

    // Add services to the container.
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddControllers();

    // JWT configuration
    var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? 
        builder.Configuration.GetSection("Jwt:SecretKey").Value;
    var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? 
        builder.Configuration.GetSection("Jwt:Issuer").Value;
    var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? 
        builder.Configuration.GetSection("Jwt:Audience").Value;

    if (string.IsNullOrEmpty(jwtSecretKey))
    {
        throw new InvalidOperationException("JWT secret key is not configured. Please set the JWT_SECRET_KEY environment variable.");
    }

    builder.Services.Configure<JwtSettings>(options =>
    {
        options.SecretKey = jwtSecretKey;
        options.Issuer = jwtIssuer ?? "InvoiceSync";
        options.Audience = jwtAudience ?? "InvoiceSync";
        options.ExpiresMinutes = 60;
    });

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer ?? "InvoiceSync",
                ValidAudience = jwtAudience ?? "InvoiceSync",
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
            };
        });

    // Configure cookie policy
    builder.Services.Configure<CookiePolicyOptions>(options =>
    {
        options.MinimumSameSitePolicy = SameSiteMode.None;
        options.Secure = CookieSecurePolicy.Always;
        options.HttpOnly = HttpOnlyPolicy.Always;
    });

    var app = builder.Build();

    // Ensure database is created
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Ensuring database is created...");
        await dbContext.Database.EnsureCreatedAsync();
        logger.LogInformation("Database check completed");
    }

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    // Add cookie policy middleware
    app.UseCookiePolicy();

    // Use CORS before authentication
    app.UseCors("AllowNetlify");

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    // Add health check endpoint
    app.MapGet("/health", () => 
    {
        return Results.Ok("Healthy");
    });

    logger.LogInformation("Application configured successfully");
    app.Run();
}
catch (Exception ex)
{
    var logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<Program>>();
    logger.LogCritical(ex, "Application startup failed");
    throw;
}
