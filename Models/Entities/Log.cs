namespace First_Web_Api_App.Models.Entities
{
    public class Log
    {
        public int Id { get; set; }
        public required string Role { get; set; }
        public required string Action { get; set; }
        public required DateTime Timestamp { get; set; }
        public string? Details { get; set; }

        public int? UserId { get; set; }
        public User? UserDetails { get; set; }
    }
}
