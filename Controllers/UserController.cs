using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AcmeGames.Data;
using AcmeGames.Models;
using AcmeGames.Resources;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcmeGames.Controllers
{
    [Produces("application/json")]
    [Route("api/users")]
    public class UserController : Controller
    {
       

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("{id}")]
		public async Task<IActionResult>
		GetUser(string id)
		{
			var user = (await Database.Users())
                        .Where(u => u.UserAccountId == id)
                        .FirstOrDefault();

            if (user == null)
                return BadRequest("User not found");

            
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (user.UserAccountId != identity.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value 
            || identity.Claims.Where(c => c.Type == ClaimTypes.Role).FirstOrDefault().Value == "Admin")
                return Unauthorized("User Information can only be accessed by the same User Account");    

            return Ok(user);
		}

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("{id}")]
		public async Task<IActionResult>
		UpdateUserDetails(string id, [FromBody] User aUser)
		{
            var userList = (await Database.Users()).ToList();
            var user = (await Database.Users())
                .Where(u => u.UserAccountId == id)
                .FirstOrDefault();
            
            if (user == null)
                return BadRequest("User not found");

            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (user.UserAccountId != identity.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value)
                return Unauthorized("User Information can only be changed by same User Account");  
            
            var userIndex = userList.IndexOf(user);
            
            user.FirstName = aUser.FirstName;
            user.LastName = aUser.LastName;

            userList[userIndex] = user;

            Database.SaveUsers(userList);

            return Ok(userList[userIndex]);
		}

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
          
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (user.UserAccountId != identity.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value)
                return Unauthorized("Password can only be changed by same User Account");

            var userIndex = userList.IndexOf(user);
            user.Password = aSetPasswordResource.Password;
            userList[userIndex] = user;

            Database.SaveUsers(userList);

            return Ok();
		}

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("set-email/{id}")]
		public async Task<IActionResult>
		setEmail(string id, [FromBody] SetEmailResource aSetEmailResource)
		{
            
            var userList = (await Database.Users()).ToList();
            var user = (await Database.Users())
                .Where(u => u.UserAccountId == id)
                .FirstOrDefault();
            
            var duplicateEmail = userList
                .Where(u => u.EmailAddress == aSetEmailResource.EmailAddress)
                .FirstOrDefault();

             var identity = HttpContext.User.Identity as ClaimsIdentity;
            
            if (user == null)
                return BadRequest("User not found");

            if (duplicateEmail != null)
                return Unauthorized("This email is already in use by another user");

            if (aSetEmailResource.Password != user.Password)
                return Unauthorized("Wrong password input");

            if (user.UserAccountId != identity.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value)
                return Unauthorized("Email can only be changed by same User Account");

            var userIndex = userList.IndexOf(user);
            user.EmailAddress = aSetEmailResource.EmailAddress;
            userList[userIndex] = user;

            Database.SaveUsers(userList);

            return Ok();
		}




    }
}