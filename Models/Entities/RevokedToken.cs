namespace First_Web_Api_App.Models.Entities
{
    public class RevokedToken
    {
        public int Id { get; set; }
        public Guid Jti { get; set; }
        public DateTime Expiration { get; set; }
    }
}
