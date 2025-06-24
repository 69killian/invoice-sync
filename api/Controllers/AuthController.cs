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
            if (string.IsNullOrWhiteSpace(req.Email))
                return BadRequest("Email requis");

            var email = req.Email.Trim().ToLowerInvariant();
            var user = _db.Users.FirstOrDefault(u => u.Email == email);
            if (user is null)
            {
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
            WriteCookie(token);

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
            var email = User.FindFirstValue(JwtRegisteredClaimNames.Email);
            var idStr = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            return Ok(new { Id = idStr, Email = email });
        }

        private string GenerateJwt(User u)
        {
            var creds = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SecretKey)),
                SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, u.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, u.Email)
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
            Response.Cookies.Append("Auth", jwt, new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddMinutes(_jwt.ExpiresMinutes)
            });
        }
    }
} 