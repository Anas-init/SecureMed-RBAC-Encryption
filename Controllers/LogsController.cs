using First_Web_Api_App.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace First_Web_Api_App.Controllers
{
    [Authorize(Roles = "admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private ApplicationDatabaseContext db;

        public LogsController(ApplicationDatabaseContext db)
        {
            this.db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs ()
        {
            var logs = await db.Logs.ToArrayAsync();
            return Ok(new {logs});
        }

        [HttpGet("User/{id}")]
        public async Task<IActionResult> GetLogByUserId (int id)
        {
            var logs = await db.Logs.Where(log => log.UserId == id).ToArrayAsync();
            return Ok(new {logs});
        }

        [HttpGet("Export")]
        public async Task<IActionResult> ExportLogCsv()
        {
            var logs = await db.Logs
                .Select(l => new
                {
                    l.Id,
                    l.UserId,
                    Username = db.Users
                        .Where(u => u.Id == l.UserId)
                        .Select(u => u.Username)
                        .FirstOrDefault() ?? "-",
                    l.Role,
                    l.Action,
                    l.Timestamp,
                    l.Details
                })
                .ToListAsync();

            if (logs.Count == 0)
                return NotFound(new { message = "No logs found to export." });

            var sb = new System.Text.StringBuilder();

            sb.AppendLine("LogId,Username,Role,Action,Details,Timestamp");

            foreach (var log in logs)
            {
                sb.AppendLine(
                    $"{log.Id}," +
                    $"{log.Username}," +  
                    $"{log.Role}," +
                    $"{log.Action}," +
                    $"{log.Details}," +
                    $"{log.Timestamp:yyyy-MM-dd HH:mm:ss}"
                );
            }

            var csvBytes = System.Text.Encoding.UTF8.GetBytes(sb.ToString());

            return File(
                csvBytes,
                "text/csv",
                $"Logs_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv"
            );
        }

    }
}
