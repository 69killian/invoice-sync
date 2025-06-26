using api.Data;
using Microsoft.EntityFrameworkCore;
using api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.Extensions.Logging;
using Npgsql;

// Force IPv4 globally at the start
// AppContext.SetSwitch("System.Net.DisableIPv6", true);  // Commenté pour permettre IPv6
System.Net.ServicePointManager.UseNagleAlgorithm = false;
System.Net.ServicePointManager.DnsRefreshTimeout = 0;

var builder = WebApplication.CreateBuilder(args);

// Simplified Kestrel configuration
builder.WebHost.ConfigureKestrel(options =>
{
    var port = int.Parse(Environment.GetEnvironmentVariable("PORT") ?? "8080");
    options.ListenAnyIP(port);
});

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

// Create logger factory
var loggerFactory = LoggerFactory.Create(builder =>
{
    builder.AddConsole();
    builder.SetMinimumLevel(LogLevel.Debug);
});

var startupLogger = loggerFactory.CreateLogger<Program>();

try
{
    startupLogger.LogInformation("Starting application...");
    startupLogger.LogInformation($"Environment: {builder.Environment.EnvironmentName}");
    startupLogger.LogInformation($"PORT: {Environment.GetEnvironmentVariable("PORT")}");
    
    // Configure CORS with detailed logging
    startupLogger.LogInformation("Configuring CORS...");

    // Add middleware to log all requests
    builder.Services.AddTransient<RequestLoggingMiddleware>();

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
            // Parse the original connection string to get the password
            var originalBuilder = new NpgsqlConnectionStringBuilder(connectionString);
            startupLogger.LogInformation("Successfully parsed original connection string");

            // Configure Npgsql with proper connection settings for Supabase Pooler
            var npgsqlBuilder = new NpgsqlConnectionStringBuilder
            {
                Host = "aws-0-eu-west-3.pooler.supabase.com",
                Port = 5432,
                Database = "postgres",
                Username = "postgres.gkggljislsuccwxyqabi",  // Format: postgres.project-ref
                Password = originalBuilder.Password,         // Use password from original connection string
                Pooling = false,                            // We're using Supabase's connection pooler
                Timeout = 30,                               // Reduced timeout since we're using pooler
                CommandTimeout = 30,
                IncludeErrorDetail = true,
                SslMode = SslMode.Require,                  // Required for Supabase
                TrustServerCertificate = true,
                KeepAlive = 30
            };

            // Log the connection string (with masked password)
            var safeConnectionString = npgsqlBuilder.ConnectionString.Replace(npgsqlBuilder.Password, "****");
            startupLogger.LogInformation($"Using connection string: {safeConnectionString}");

            options.UseNpgsql(npgsqlBuilder.ConnectionString, o =>
            {
                o.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(10),  // Reduced retry delay for pooler
                    errorCodesToAdd: null
                );
                o.CommandTimeout(30);
                o.MigrationsHistoryTable("__EFMigrationsHistory");
            });

            // Test the connection immediately
            using var connection = new NpgsqlConnection(npgsqlBuilder.ConnectionString);
            try
            {
                startupLogger.LogInformation($"Testing initial connection to {npgsqlBuilder.Host}:{npgsqlBuilder.Port}...");
                connection.Open();
                startupLogger.LogInformation($"Initial connection test successful to {npgsqlBuilder.Host}:{npgsqlBuilder.Port}");
            }
            catch (Exception ex)
            {
                startupLogger.LogError(ex, $"Failed to open connection to {npgsqlBuilder.Host}:{npgsqlBuilder.Port}");
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
        options.AddPolicy("AllowVercel", policy =>
        {
            policy
                .WithOrigins("https://invoice-sync-lilac.vercel.app")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithExposedHeaders("Set-Cookie", "Authorization")
                .SetPreflightMaxAge(TimeSpan.FromSeconds(86400));
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
        options.OnAppendCookie = cookieContext =>
        {
            cookieContext.CookieOptions.SameSite = SameSiteMode.None;
            cookieContext.CookieOptions.Secure = true;
        };
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

    // Add request logging middleware
    app.UseMiddleware<RequestLoggingMiddleware>();

    // Configure middleware pipeline
    app.UseRouting();

    // Configure CORS - must be after UseRouting and before UseAuthentication
    app.UseCors("AllowVercel");

    // Configure cookie policy
    app.UseCookiePolicy(new CookiePolicyOptions
    {
        MinimumSameSitePolicy = SameSiteMode.None,
        Secure = CookieSecurePolicy.Always,
        HttpOnly = HttpOnlyPolicy.Always
    });

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    // Add health check endpoint
    app.MapGet("/health", () => 
    {
        return Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    });

    startupLogger.LogInformation("Application configured successfully");
    app.Run();
}
catch (Exception ex)
{
    startupLogger.LogCritical(ex, "Application startup failed");
    throw;
}

// Request logging middleware
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
    {
        _next = next;
        _logger = loggerFactory.CreateLogger<RequestLoggingMiddleware>();
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            _logger.LogInformation($"Request: {context.Request.Method} {context.Request.Path}");
            _logger.LogInformation($"Origin: {context.Request.Headers["Origin"]}");
            _logger.LogInformation($"Headers: {string.Join(", ", context.Request.Headers.Select(h => $"{h.Key}: {h.Value}"))}");

            await _next(context);

            _logger.LogInformation($"Response Status: {context.Response.StatusCode}");
            _logger.LogInformation($"Response Headers: {string.Join(", ", context.Response.Headers.Select(h => $"{h.Key}: {h.Value}"))}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing request");
            throw;
        }
    }
}
