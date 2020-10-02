using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AcmeGames.Data;
using AcmeGames.Models;
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




    }
}