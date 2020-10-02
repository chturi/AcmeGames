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
			var DBUsers = await Database.Users();
            return DBUsers;
		}
        
        [HttpGet("{id}")]
		public async Task<IActionResult>
		GetUser(string id)
		{
			var DBUsers = await Database.Users();
			var user = DBUsers.Where(u => u.UserAccountId == id).FirstOrDefault();

            if (user == null)
                return BadRequest("User not found");    


            return Ok(user);
		}

        [HttpPut("{id}")]
		public async Task<IActionResult>
		EditUser(string id, [FromBody] User aUser)
		{
			var DBUsers = await Database.Users();
            var userList = DBUsers.ToList();
			var user = DBUsers.Where(u => u.UserAccountId == id).FirstOrDefault();
            
            if (user == null)
                return BadRequest("User not found");  
            
            var userIndex = DBUsers.ToList().IndexOf(user);
            userList[userIndex] = aUser;

            Database.SaveUsers(userList);

            return Ok(userList[userIndex]);
		}




    }
}