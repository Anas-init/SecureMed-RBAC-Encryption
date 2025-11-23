namespace First_Web_Api_App.Models.Entities
{
    public class Patient
    {
        public int Id { get; set; }
        public required string Name { get; set; }    
        public required string Contact { get; set; }
        public required string Diagnosis { get; set; }
        public required string AnonymizedName { get; set; }
        public required string AnonymizedContact { get; set; }
        public DateTime DateAdded { get; set; }
    }
}
