using First_Web_Api_App.Model;
using First_Web_Api_App.Models.Dtos;
using First_Web_Api_App.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace First_Web_Api_App.Controllers
{
    [Authorize(Roles = "admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private ApplicationDatabaseContext db;

        public UsersController(ApplicationDatabaseContext db)
        {
            this.db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await db.Users
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.Password,
                    u.Role,
                })
                .ToListAsync();

            return Ok(new { users });
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser (UserSignUpDto data)
        {
            var UserAlreadyExists = await db.Users.FirstOrDefaultAsync(user => user.Username == data.Username); ;

            if (UserAlreadyExists is not null)
            {
                return BadRequest(new { message = "User already exists!" });
            }

            var HashedPassword = new PasswordHasher<UserSignUpDto>()
                .HashPassword(data, data.Password);

            var NewUser = new User()
            {
                Username = data.Username,
                Password = HashedPassword,
                Role = data.Role
            };

            await db.Users.AddAsync(NewUser);
            await db.SaveChangesAsync();

            return Created("", new
            {
                NewUser.Id,
                NewUser.Username,
                NewUser.Role
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto UpdatedUser)
        {
            if (UpdatedUser is null)
                return BadRequest(new { message = "Invalid body" });

            if (UpdatedUser.Role is null && UpdatedUser.Password is null)
                return Ok(new { message = "User unchanged!" });

            var user = await db.Users.FindAsync(id);
            if (user is null)
                return NotFound(new { message = "User not found!" });

            if (!string.IsNullOrEmpty(UpdatedUser.Role))
                user.Role = UpdatedUser.Role;

            if (!string.IsNullOrEmpty(UpdatedUser.Password))
            {
                var hasher = new PasswordHasher<User>();
                user.Password = hasher.HashPassword(user, UpdatedUser.Password);
            }

            await db.SaveChangesAsync();

            return Ok(new { message = "User updated successfully!" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            int rowsAffected = await db.Users
                .Where(u => u.Id == id)
                .ExecuteDeleteAsync();

            if (rowsAffected == 0)
                return NotFound(new { message = "User not found!" });

            return Ok(new { message = "User deleted successfully!" });
        }
    }
}
