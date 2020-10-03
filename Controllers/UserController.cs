using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AcmeGames.Data;
using AcmeGames.Models;
using AcmeGames.Resources;
using Microsoft.AspNetCore.Mvc;

namespace AcmeGames.Controllers
{
    [Produces("application/json")]
    [Route("api/users")]
    public class UserController : Controller
    {
        [HttpGet]
		public async Task<IEnumerable<User>>
		GetUsers()
		{
            return await Database.Users();
		}
        
        [HttpGet("{id}")]
		public async Task<IActionResult>
		GetUser(string id)
		{
			var user = (await Database.Users())
                        .Where(u => u.UserAccountId == id)
                        .FirstOrDefault();

            if (user == null)
                return BadRequest("User not found");    

            return Ok(user);
		}

        [HttpPut("{id}")]
		public async Task<IActionResult>
		EditUser(string id, [FromBody] User aUser)
		{
            var userList = (await Database.Users()).ToList();
            var user = (await Database.Users())
                .Where(u => u.UserAccountId == id)
                .FirstOrDefault();
            
            if (user == null)
                return BadRequest("User not found");  
            
            var userIndex = userList.IndexOf(user);
            userList[userIndex] = aUser;

            Database.SaveUsers(userList);

            return Ok(userList[userIndex]);
		}

        [HttpPut("set-password/{id}")]
		public async Task<IActionResult>
		setPassword(string id, [FromBody] SetPasswordResource aSetPasswordResource)
		{
            
            var userList = (await Database.Users()).ToList();
            var user = (await Database.Users())
                .Where(u => u.UserAccountId == id)
                .FirstOrDefault();
            
            if (user == null)
                return BadRequest("User not found");

            if (aSetPasswordResource.CurrentPassword != user.Password)
                return Unauthorized("Wrong current password input");
            
            // if (user.UserAccountId != User.Claims.Where(c => c.ValueType == ClaimTypes.NameIdentifier).FirstOrDefault().Value)
            //     return Unauthorized("Password can only be changed by same User Account");

            var userIndex = userList.IndexOf(user);
            user.Password = aSetPasswordResource.Password;
            userList[userIndex] = user;

            Database.SaveUsers(userList);

            return Ok();
		}




    }
}