using First_Web_Api_App.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.Json;

namespace First_Web_Api_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemController : ControllerBase
    {
        private readonly ApplicationDatabaseContext db;
        private static readonly Stopwatch Uptime = Stopwatch.StartNew();

        public SystemController(ApplicationDatabaseContext db)
        {
            this.db = db;
        }

        [HttpGet("Healthcheck")]
        [AllowAnonymous]
        public async Task<IActionResult> HealthCheck()
        {
            bool dbOk = true;

            try
            {
                await db.Database.ExecuteSqlRawAsync("SELECT 1;");
            }
            catch
            {
                dbOk = false;
            }

            return Ok(new
            {
                api = "Online",
                database = dbOk ? "Connected" : "Error",
                timestamp = DateTime.UtcNow
            });
        }

        [HttpGet("Backup/Database")]
        public async Task<IActionResult> BackupDatabase()
        {
            var patients = await db.Patients
                .AsNoTracking()
                .Select(p => new { p.Id, p.Name, p.Contact, p.AnonymizedName, p.AnonymizedContact, p.DateAdded, p.Diagnosis })
                .ToArrayAsync();

            var users = await db.Users
                .AsNoTracking()
                .Select(u => new { u.Id, u.Username, u.Role, u.Password })
                .ToArrayAsync();

            var logs = await db.Logs
                .AsNoTracking()
                .Select(l => new { l.Id, l.UserId, l.Action, l.Timestamp, l.Details, l.Role })
                .ToArrayAsync();

            var revoked = await db.RevokedTokens
                .AsNoTracking()
                .Select(r => new { r.Id, r.Jti, r.Expiration, })
                .ToArrayAsync();

            var data = new { Patients = patients, Users = users, Logs = logs, RevokedTokens = revoked };

            var json = System.Text.Json.JsonSerializer.Serialize(data, 
                new System.Text.Json.JsonSerializerOptions { 
                    WriteIndented = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

            var bytes = System.Text.Encoding.UTF8.GetBytes(json);
            var fileName = $"DB_Backup_{DateTime.UtcNow:yyyyMMdd_HHmmss}.json";
            return File(bytes, "application/json", fileName);
        }


        [HttpGet("Uptime")]
        [Authorize(Roles = "admin")]
        public IActionResult GetSystemUptime()
        {
            return Ok(new
            {
                uptime = Uptime.Elapsed.ToString(@"dd\.hh\:mm\:ss"),
                uptimeSeconds = (long)Uptime.Elapsed.TotalSeconds
            });
        }
    }
}
