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
    //Api used for users on the account page to get and update user information
    [Produces("application/json")]
    [Route("api/users")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserController : Controller
    {
       
        //Request to get single user from DB
        [HttpGet("{id}")]
		public async Task<IActionResult>
		GetUser(string id)
		{
            //try to find user  by useraccountID from request URL
			var user = (await Database.Users())
                        .Where(u => u.UserAccountId == id)
                        .FirstOrDefault();

            if (user == null)
                return BadRequest("User not found");

            //Creates an Identity to get claims from request, this to verify that the user requesting information has the same ID as the user requested
            //Only admins are allowed to get information from another User
            var identity = HttpContext.User.Identity as ClaimsIdentity;
        

            if (user.UserAccountId != identity.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value 
            && identity.Claims.Where(c => c.Type == ClaimTypes.Role).FirstOrDefault().Value != "Admin")
                return Unauthorized("User Information can only be accessed by the same User Account");    

            return Ok(user);
		}

        //Request to update User details
        [HttpPut("{id}")]
		public async Task<IActionResult>
		UpdateUserDetails(string id, [FromBody] User aUser)
		{
            //Query user and verify that they exists
            var userList = (await Database.Users()).ToList();
            var user = userList
                .Where(u => u.UserAccountId == id)
                .FirstOrDefault();
            
            if (user == null)
                return BadRequest("User not found");

            //Only users with the same ID as the payload may change id, this is done by verifying payload with Idenity claims
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (user.UserAccountId != identity.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value)
                return Unauthorized("User Information can only be changed by same User Account");  
            
            //update userinformation and saves to DB
            var userIndex = userList.IndexOf(user);
            
            user.FirstName = aUser.FirstName;
            user.LastName = aUser.LastName;

            userList[userIndex] = user;

            Database.SaveUsers(userList);

            return Ok(userList[userIndex]);
		}

        //Request to set new password
        [HttpPut("set-password/{id}")]
		public async Task<IActionResult>
		setPassword(string id, [FromBody] SetPasswordResource aSetPasswordResource)
		{
            //get user by payload ID, verify that the users exsists and that the old password is the same as the user in DB
            var userList = (await Database.Users()).ToList();
            var user = userList
                .Where(u => u.UserAccountId == id)
                .FirstOrDefault();
            
            if (user == null)
                return BadRequest("User not found");

            if (aSetPasswordResource.CurrentPassword != user.Password)
                return Unauthorized("Wrong current password input");
          
          //Verify with identity claims that it is the same user that sends the payload is updated
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (user.UserAccountId != identity.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value)
                return Unauthorized("Password can only be changed by same User Account");

            //Sets password and saves to DB
            var userIndex = userList.IndexOf(user);
            user.Password = aSetPasswordResource.Password;
            userList[userIndex] = user;

            Database.SaveUsers(userList);

            return Ok();
		}

        //Request to set new email
        [HttpPut("set-email/{id}")]
		public async Task<IActionResult>
		setEmail(string id, [FromBody] SetEmailResource aSetEmailResource)
		{
            //get user from userAccount given in the payload, verify that they exsists and there are no duplicate to the new requested email
            var userList = (await Database.Users()).ToList();
            var user = userList
                .Where(u => u.UserAccountId == id)
                .FirstOrDefault();
            
            var duplicateEmail = userList
                .Where(u => u.EmailAddress == aSetEmailResource.EmailAddress)
                .FirstOrDefault();
            
            //verify that it is the same user requesting the change that is in the DB
             var identity = HttpContext.User.Identity as ClaimsIdentity;
            
            if (user == null)
                return BadRequest("User not found");

            if (duplicateEmail != null)
                return Unauthorized("This email is already in use by another user");

            if (aSetEmailResource.Password != user.Password)
                return Unauthorized("Wrong password input");

            if (user.UserAccountId != identity.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value)
                return Unauthorized("Email can only be changed by same User Account");

            //Updates email and saves to DB
            var userIndex = userList.IndexOf(user);
            user.EmailAddress = aSetEmailResource.EmailAddress;
            userList[userIndex] = user;

            Database.SaveUsers(userList);

            return Ok();
		}




    }
}