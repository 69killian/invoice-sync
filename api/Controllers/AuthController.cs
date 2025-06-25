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

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtSettings _jwt;

        public AuthController(AppDbContext db, IOptions<JwtSettings> jwt)
        {
            _db = db;
            _jwt = jwt.Value;
        }

        public record LoginRequest(string Email);

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            Console.WriteLine($"Login attempt for email: {req.Email}");
            
            if (string.IsNullOrWhiteSpace(req.Email))
                return BadRequest("Email requis");

            var email = req.Email.Trim().ToLowerInvariant();
            var user = _db.Users.FirstOrDefault(u => u.Email == email);
            if (user is null)
            {
                Console.WriteLine($"Creating new user for email: {email}");
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
            Console.WriteLine($"Generated JWT token length: {token.Length}");
            WriteCookie(token);
            Console.WriteLine("Cookie written to response");

            var setCookie = Response.Headers["Set-Cookie"].ToString();
            Console.WriteLine($"Set-Cookie header: {setCookie}");
            Console.WriteLine($"Cookie settings: HttpOnly={setCookie.Contains("HttpOnly")}, Secure={setCookie.Contains("Secure")}, SameSite={setCookie.Contains("SameSite=None")}");

            return Ok(new { user.Id, user.Email });
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("Auth");
            return NoContent();
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            Console.WriteLine("ME endpoint called");
            Console.WriteLine($"Auth cookie present: {Request.Cookies.ContainsKey("Auth")}");
            if (Request.Cookies.TryGetValue("Auth", out var authCookie))
            {
                Console.WriteLine($"Auth cookie value length: {authCookie.Length}");
            }
            Console.WriteLine($"Authorization header present: {Request.Headers.ContainsKey("Authorization")}");
            Console.WriteLine($"Origin header: {Request.Headers["Origin"]}");
            
            // Ajouter des en-têtes CORS explicites
            var origin = Request.Headers["Origin"].ToString();
            if (!string.IsNullOrEmpty(origin))
            {
                Response.Headers["Access-Control-Allow-Origin"] = origin;
                Response.Headers["Access-Control-Allow-Credentials"] = "true";
            }
            
            var email = User.FindFirstValue(ClaimTypes.Email);
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            Console.WriteLine($"Claims found - Email: {email != null}, Id: {idStr != null}");
            Console.WriteLine($"Email value: {email}, Id value: {idStr}");
            
            return Ok(new { Id = idStr, Email = email });
        }

        private string GenerateJwt(User u)
        {
            var creds = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SecretKey)),
                SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, u.Id.ToString()),
                new Claim(ClaimTypes.Email, u.Email)
            };

            var token = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwt.ExpiresMinutes),
                signingCredentials: creds);

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
            
            Console.WriteLine("Writing cookie with options:");
            Console.WriteLine($"HttpOnly: {cookieOptions.HttpOnly}");
            Console.WriteLine($"Secure: {cookieOptions.Secure}");
            Console.WriteLine($"SameSite: {cookieOptions.SameSite}");
            Console.WriteLine($"Expires: {cookieOptions.Expires}");
            Console.WriteLine($"Path: {cookieOptions.Path}");
            Console.WriteLine($"Domain: {cookieOptions.Domain}");
            
            // Ajouter des en-têtes CORS explicites
            var origin = Request.Headers["Origin"].ToString();
            if (!string.IsNullOrEmpty(origin))
            {
                Response.Headers["Access-Control-Allow-Origin"] = origin;
                Response.Headers["Access-Control-Allow-Credentials"] = "true";
            }
            
            Response.Cookies.Append("Auth", jwt, cookieOptions);
        }
    }
} 