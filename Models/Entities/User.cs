namespace First_Web_Api_App.Models.Entities
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }

        public List<Log> UserLogs { get; set; } = new();
    }
}
