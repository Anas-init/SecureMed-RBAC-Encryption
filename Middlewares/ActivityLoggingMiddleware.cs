using First_Web_Api_App.Model;
using First_Web_Api_App.Models.Entities;
using System.Security.Claims;

namespace First_Web_Api_App.Middlewares
{
    public class ActivityLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IServiceScopeFactory _scopeFactory;

        public ActivityLoggingMiddleware(RequestDelegate next, IServiceScopeFactory scopeFactory)
        {
            _next = next;
            _scopeFactory = scopeFactory;
        }

        public async Task Invoke(HttpContext context)
        {
            // Run next middleware first
            await _next(context);

            // create new scope for DbContext
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDatabaseContext>();

            var userIdClaim = context.User.Claims.FirstOrDefault(c => c.Type == "id");
            var roleClaim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);

            foreach (var claim in context.User.Claims)
            {
                Console.WriteLine($"CLAIM: {claim.Type} = {claim.Value}");
            }


            int? userId = userIdClaim != null ? int.Parse(userIdClaim.Value) : null;

            Console.WriteLine("User id: " + userId);

            var log = new Log
            {
                UserId = userId,
                Role = roleClaim?.Value ?? "Anonymous",
                Action = context.Request.Method,
                Timestamp = DateTime.UtcNow,
                Details = context.Request.Path
            };

            db.Logs.Add(log);
            await db.SaveChangesAsync();
        }
    }
}
