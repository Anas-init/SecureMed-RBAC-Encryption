using System.ComponentModel.DataAnnotations;

namespace First_Web_Api_App.Models.Dtos
{
    public class AddPatientDto
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Contact { get; set; }
        [Required]
        public required string Diagnosis { get; set; }
    }
}
