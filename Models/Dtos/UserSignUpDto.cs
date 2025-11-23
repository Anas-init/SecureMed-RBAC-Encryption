namespace First_Web_Api_App.Models.Dtos
{
    public class UserSignUpDto
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }
    }
}
