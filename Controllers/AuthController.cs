using First_Web_Api_App.Model;
using First_Web_Api_App.Models.Dtos;
using First_Web_Api_App.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace First_Web_Api_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private ApplicationDatabaseContext db;
        private IConfiguration configuration;
        public AuthController(ApplicationDatabaseContext db, IConfiguration configuration)
        {
            this.db = db;
            this.configuration = configuration;
        }

        [AllowAnonymous]
        [HttpPost("Sign-In")]
        public async Task<IActionResult> SignIn (UserSignInDto data) {
            var UserDetails = await db.Users.FirstOrDefaultAsync(user => user.Username == data.Username);

            if (UserDetails is null)
            {
                return NotFound(new { message = "User not found!"});
            }

            var PasswordMatched = new PasswordHasher<User>()
                .VerifyHashedPassword(UserDetails, UserDetails.Password, data.Password);

            if (PasswordMatched == PasswordVerificationResult.Failed)
            {
                return BadRequest(new { message = "Invalid Password!"});
            }

            return Ok(new
            {
                token = CreateToken(UserDetails)
            });
        }

        [Authorize]
        [HttpPost("Log-Out")]
        public async Task<IActionResult> Logout ()
        {
            var jti = User.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
            var exp = User.FindFirst(JwtRegisteredClaimNames.Exp)?.Value;

            if (jti is null || exp is null)
                return BadRequest(new { message = "Invalid Token" });

            var expirationTime = DateTimeOffset.FromUnixTimeSeconds(long.Parse(exp)).UtcDateTime;

            var revoked = new RevokedToken
            {
                Jti = Guid.Parse(jti),
                Expiration = expirationTime
            };

            await db.RevokedTokens.AddAsync(revoked);
            await db.SaveChangesAsync();

            return Ok(new { message = "User logged out and token revoked." });
        }
        private string CreateToken (User UserDetails)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim("id", UserDetails.Id.ToString()),
                new Claim("username", UserDetails.Username),
                new Claim("role", UserDetails.Role),
                new Claim("jti", Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(2),
                signingCredentials: creds
            );

            var token = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);

            return token;
        }
    }
}
