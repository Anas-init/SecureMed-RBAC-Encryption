using First_Web_Api_App.Model;
using First_Web_Api_App.Models.Dtos;
using First_Web_Api_App.Models.Entities;
using First_Web_Api_App.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace First_Web_Api_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private ApplicationDatabaseContext db;
        public PatientsController(ApplicationDatabaseContext db)
        {
            this.db = db;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await db.Patients.ToArrayAsync();

            return Ok(new { patients });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetPatient (int id)
        {
            var patient = await db.Patients.FindAsync(id);

            return Ok(new { patient });
        }

        [HttpGet("Anonymize")]
        [Authorize]
        public async Task<IActionResult> GetPatientMaskedData ()
        {
            var patients = await db.Patients.Select(
                patient => new { patient.Id, patient.AnonymizedName, patient.AnonymizedContact }
            ).ToArrayAsync();

            return Ok(new { patients });
        }

        [HttpPost]
        [Authorize(Roles = "admin,receptionist")]
        public async Task<IActionResult> AddPatient (AddPatientDto patient)
        {
            Patient NewPatient = new Patient()
            {
                Name = patient.Name,
                Contact = patient.Contact,
                DateAdded = DateTime.UtcNow,
                Diagnosis = patient.Diagnosis,
                AnonymizedContact = "",
                AnonymizedName = ""
            };

            await db.Patients.AddAsync(NewPatient);
            await db.SaveChangesAsync();

            return Created("", new {message = "Patient record added!"});
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,receptionist")]
        public async Task<IActionResult> UpdatePatient (int id, [FromBody] AddPatientDto patient)
        {
            Patient? CurrentPatient = await db.Patients.FindAsync(id);

            if (CurrentPatient is null)
                return NotFound(new { message = "Patient record not found" });

            CurrentPatient.Name = patient.Name;
            CurrentPatient.Contact = patient.Contact;
            CurrentPatient.Diagnosis = patient.Diagnosis;
            CurrentPatient.AnonymizedName = "";
            CurrentPatient.AnonymizedContact = "";


            await db.SaveChangesAsync();

            return Ok(new {message = "Patient record updated!", patient = CurrentPatient});
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeletePatient (int id)
        {
            int rowsAffected = await db.Patients
                .Where(u => u.Id == id)
                .ExecuteDeleteAsync();

            if (rowsAffected == 0)
                return NotFound(new { message = "Patient record not found!" });

            return Ok(new { message = "Patient deleted successfully!" });
        }

        [HttpPost("Anonymize/All")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AnonymizeAllPatients()
        {
            var patients = await db.Patients.ToListAsync();

            if (patients.Count == 0)
                return Ok(new { message = "No patients available to anonymize." });

            foreach (var p in patients)
            {
                p.AnonymizedName = Anonymizer.MaskName(p.Name);
                p.AnonymizedContact = Anonymizer.MaskContact(p.Contact);
            }

            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "All patient records anonymized successfully!",
                totalAnonymized = patients.Count
            });
        }

        [HttpPost("Anonymize/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AnonymizePatient(int id)
        {
            var patient = await db.Patients.FindAsync(id);

            if (patient == null)
                return NotFound(new { message = "Patient not found!" });

            patient.AnonymizedName = Anonymizer.MaskName(patient.Name);
            patient.AnonymizedContact = Anonymizer.MaskContact(patient.Contact);

            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Patient anonymized successfully!",
                patient = new
                {
                    patient.Id,
                    patient.AnonymizedName,
                    patient.AnonymizedContact
                }
            });
        }

    }
}
