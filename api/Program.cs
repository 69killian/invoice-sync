using api.Data;
using Microsoft.EntityFrameworkCore;
using api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.Extensions.Logging;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Configure port for Railway
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Create logger factory
var loggerFactory = LoggerFactory.Create(builder =>
{
    builder.AddConsole();
    builder.SetMinimumLevel(LogLevel.Information);
});

var startupLogger = loggerFactory.CreateLogger<Program>();

try
{
    startupLogger.LogInformation("Starting application...");
    startupLogger.LogInformation($"Environment: {builder.Environment.EnvironmentName}");
    
    // Log connection string (masked)
    var connString = builder.Configuration.GetConnectionString("DefaultConnection");
    startupLogger.LogInformation($"Database connection configured: {(connString != null ? "Yes" : "No")}");

    // Add DbContext
    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? 
            builder.Configuration.GetConnectionString("DefaultConnection");
        
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Database connection string is not configured. Please set the DATABASE_URL environment variable.");
        }

        startupLogger.LogInformation("Configuring database connection...");

        try 
        {
            // Force IPv4
            AppContext.SetSwitch("System.Net.DisableIPv6", true);

            // Parse and modify the host from the connection string
            var tempBuilder = new NpgsqlConnectionStringBuilder(connectionString);
            var modifiedHost = tempBuilder.Host.Replace("db.", ""); // Remove 'db.' prefix if present

            // Configure Npgsql with proper connection settings
            var npgsqlBuilder = new NpgsqlConnectionStringBuilder
            {
                Host = modifiedHost,
                Port = tempBuilder.Port,
                Database = tempBuilder.Database,
                Username = tempBuilder.Username,
                Password = tempBuilder.Password,
                Pooling = false,
                Timeout = 60,                    // Increased timeout
                CommandTimeout = 60,             // Increased command timeout
                IncludeErrorDetail = true,
                SslMode = SslMode.Require,       // Changed to Require for Supabase
                TrustServerCertificate = true,   // Trust the Supabase certificate
                KeepAlive = 30,
                ConnectionIdleLifetime = 300,    // 5 minutes idle timeout
                ConnectionPruningInterval = 60,  // Check for idle connections every minute
                MaxPoolSize = 5                  // Limit pool size
            };

            startupLogger.LogInformation($"Attempting to connect to database at {npgsqlBuilder.Host}:{npgsqlBuilder.Port}");

            options.UseNpgsql(npgsqlBuilder.ConnectionString, o =>
            {
                o.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorCodesToAdd: null
                );
                o.CommandTimeout(60);
                o.MigrationsHistoryTable("__EFMigrationsHistory");
            });

            // Test the connection immediately
            using var connection = new NpgsqlConnection(npgsqlBuilder.ConnectionString);
            try
            {
                startupLogger.LogInformation("Testing initial connection...");
                connection.Open();
                startupLogger.LogInformation("Initial connection test successful");
            }
            catch (Exception ex)
            {
                startupLogger.LogError(ex, "Initial connection test failed");
                throw;
            }

            startupLogger.LogInformation("Database configuration completed successfully");
        }
        catch (Exception ex)
        {
            startupLogger.LogError(ex, "Error configuring database connection");
            throw;
        }
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
        try
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var scopedLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            scopedLogger.LogInformation("Ensuring database is created...");
            
            // Add delay before database operations
            await Task.Delay(TimeSpan.FromSeconds(5));
            
            // First check if we can connect
            scopedLogger.LogInformation("Testing database connection...");
            if (await dbContext.Database.CanConnectAsync())
            {
                scopedLogger.LogInformation("Database connection test successful");
                
                // Then ensure database is created
                await dbContext.Database.EnsureCreatedAsync();
                scopedLogger.LogInformation("Database check completed");
            }
            else
            {
                throw new Exception("Could not connect to the database after startup");
            }
        }
        catch (Exception ex)
        {
            var scopedLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            scopedLogger.LogError(ex, "Error during database initialization");
            throw;
        }
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

    startupLogger.LogInformation("Application configured successfully");
    app.Run();
}
catch (Exception ex)
{
    startupLogger.LogCritical(ex, "Application startup failed");
    throw;
}
