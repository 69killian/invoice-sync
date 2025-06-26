using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Data;
using api.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Cors;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowVercel")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtSettings _jwt;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext db, IOptions<JwtSettings> jwt, ILogger<AuthController> logger)
        {
            _db = db;
            _jwt = jwt.Value;
            _logger = logger;
        }

        private void AddCorsHeaders()
        {
            Response.Headers["Access-Control-Allow-Origin"] = "https://invoice-sync-lilac.vercel.app";
            Response.Headers["Access-Control-Allow-Credentials"] = "true";
            Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
            Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin, Referer, User-Agent, Sec-Ch-Ua, Sec-Ch-Ua-Mobile, Sec-Ch-Ua-Platform";
            Response.Headers["Access-Control-Expose-Headers"] = "Set-Cookie, Authorization";
            Response.Headers["Access-Control-Max-Age"] = "86400";
            
            // Log tous les headers pour le débogage
            _logger.LogInformation("Response CORS Headers:");
            foreach (var header in Response.Headers)
            {
                _logger.LogInformation($"{header.Key}: {header.Value}");
            }
        }

        public record LoginRequest(string Email);

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            _logger.LogInformation($"Login attempt from origin: {Request.Headers["Origin"]}");
            _logger.LogInformation($"Request headers: {string.Join(", ", Request.Headers.Select(h => $"{h.Key}: {h.Value}"))}");
            
            AddCorsHeaders();
            
            if (string.IsNullOrWhiteSpace(req.Email))
                return BadRequest("Email requis");

            var email = req.Email.Trim().ToLowerInvariant();
            var user = _db.Users.FirstOrDefault(u => u.Email == email);
            if (user is null)
            {
                _logger.LogInformation($"Creating new user for email: {email}");
                user = new User
                {
                    Id = Guid.NewGuid(),
                    Email = email,
                    CreatedAt = DateTime.UtcNow
                };
                _db.Users.Add(user);
                await _db.SaveChangesAsync();
            }

            var token = GenerateJwt(user);
            _logger.LogInformation($"Generated JWT token length: {token.Length}");
            WriteCookie(token);
            _logger.LogInformation("Cookie written to response");

            var setCookie = Response.Headers["Set-Cookie"].ToString();
            _logger.LogInformation($"Set-Cookie header: {setCookie}");
            _logger.LogInformation($"Cookie settings: HttpOnly={setCookie.Contains("HttpOnly")}, Secure={setCookie.Contains("Secure")}, SameSite={setCookie.Contains("SameSite=None")}");

            return Ok(new { user.Id, user.Email });
        }

        [HttpOptions("login")]
        [AllowAnonymous]
        public IActionResult LoginOptions()
        {
            _logger.LogInformation("OPTIONS request received for /login");
            AddCorsHeaders();
            return Ok();
        }

        [HttpOptions("me")]
        [AllowAnonymous]
        public IActionResult MeOptions()
        {
            _logger.LogInformation("OPTIONS request received for /me");
            AddCorsHeaders();
            return Ok();
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            AddCorsHeaders();
            Response.Cookies.Delete("Auth");
            return NoContent();
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            _logger.LogInformation("ME endpoint called");
            _logger.LogInformation($"Auth cookie present: {Request.Cookies.ContainsKey("Auth")}");
            if (Request.Cookies.TryGetValue("Auth", out var authCookie))
            {
                _logger.LogInformation($"Auth cookie value length: {authCookie.Length}");
            }
            _logger.LogInformation($"Authorization header present: {Request.Headers.ContainsKey("Authorization")}");
            _logger.LogInformation($"Origin header: {Request.Headers["Origin"]}");
            
            AddCorsHeaders();
            
            var email = User.FindFirstValue(ClaimTypes.Email);
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            _logger.LogInformation($"Claims found - Email: {email != null}, Id: {idStr != null}");
            _logger.LogInformation($"Email value: {email}, Id value: {idStr}");
            
            return Ok(new { Id = idStr, Email = email });
        }

        private string GenerateJwt(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwt.ExpiresMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void WriteCookie(string jwt)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddMinutes(_jwt.ExpiresMinutes),
                Path = "/",
                Domain = null  // Permet au cookie d'être envoyé au domaine actuel
            };
            
            _logger.LogInformation("Writing cookie with options:");
            _logger.LogInformation($"HttpOnly: {cookieOptions.HttpOnly}");
            _logger.LogInformation($"Secure: {cookieOptions.Secure}");
            _logger.LogInformation($"SameSite: {cookieOptions.SameSite}");
            _logger.LogInformation($"Expires: {cookieOptions.Expires}");
            _logger.LogInformation($"Path: {cookieOptions.Path}");
            _logger.LogInformation($"Domain: {cookieOptions.Domain}");
            
            // Ajouter des en-têtes CORS explicites pour les cookies
            Response.Headers["Access-Control-Allow-Origin"] = "https://invoice-sync-lilac.vercel.app";
            Response.Headers["Access-Control-Allow-Credentials"] = "true";
            Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
            Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept";
            Response.Headers["Access-Control-Expose-Headers"] = "Set-Cookie";
            
            Response.Cookies.Append("Auth", jwt, cookieOptions);

            // Log le cookie pour debug
            _logger.LogInformation($"Cookie Auth set with value length: {jwt.Length}");
            _logger.LogInformation($"Response headers: {string.Join(", ", Response.Headers.Select(h => $"{h.Key}: {h.Value}"))}");
        }
    }
} 