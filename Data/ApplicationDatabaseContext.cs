using First_Web_Api_App.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace First_Web_Api_App.Model
{
    public class ApplicationDatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Log> Logs { get; set; }
        public DbSet<RevokedToken> RevokedTokens { get; set; }
        public ApplicationDatabaseContext(DbContextOptions<ApplicationDatabaseContext> options) : base(options) {}
    }
}
