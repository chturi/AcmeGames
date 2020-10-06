using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AcmeGames.Data;
using AcmeGames.Models;
using AcmeGames.Resources;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcmeGames.Controllers
{
    //Admin controller, API Calls made only by admins related to the admin-console Page
    [Produces("application/json")]
    [Route("api/admin")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles ="Admin")]
    public class AdminsController: Controller
    {

        //Request to get all users
        [HttpGet("users")]
		public async Task<IEnumerable<User>>
		GetUsers()
		{
            //Select all properties except password, to not respond back with all user passwords
            var users = (await Database.Users())
            .Select(u => new User{
                UserAccountId = u.UserAccountId,
                FirstName = u.FirstName,
                LastName = u.LastName,
                EmailAddress = u.EmailAddress,
                DateOfBirth = u.DateOfBirth,
                IsAdmin = u.IsAdmin,
            }).ToList();

            return users;
		}

        //Request to update user Information, all except password
        [HttpPut("users/{id}")]
		public async Task<IActionResult>
		UpdateUser(string id, [FromBody] UpdateUserAdminResource aUser)
		{
            //Query the DB for all users and check if I get a result
            var userList = (await Database.Users()).ToList();
            var user = userList
                .Where(u => u.UserAccountId == id)
                .FirstOrDefault();
            
            if (user == null)
                return BadRequest("User not found");

            //If requester want to change email, need to verify that the same email does not exsist in the DB
            var duplicateEmail = userList
                .Where(u => u.EmailAddress == aUser.EmailAddress && u.UserAccountId != aUser.UserAccountId)
                .FirstOrDefault();
            
            if (duplicateEmail != null)
                return Unauthorized("Email is already in use");
            
            //Assign new user properties with information from payload and replace that information with old user in DB 
            var userIndex = userList.IndexOf(user);
            
            user.FirstName = aUser.FirstName;
            user.LastName = aUser.LastName;
            user.EmailAddress = aUser.EmailAddress;
            user.DateOfBirth = aUser.DateOfBirth;
            user.IsAdmin = (aUser.Role == "Admin") ? true : false;
                    
            userList[userIndex] = user;

            Database.SaveUsers(userList);

            return Ok(userList[userIndex]);
		}

        //Request to reset user password
        [HttpPut("set-password/{id}")]
		public async Task<IActionResult>
		resetPassword(string id, [FromBody] SetPasswordResource aSetPasswordResource)
		{
            //verify that the user exsists and then assigns new password and replaces old user in DB
            var userList = (await Database.Users()).ToList();
            var user = userList
                .Where(u => u.UserAccountId == id)
                .FirstOrDefault();
            
            if (user == null)
                return BadRequest("User not found");

            var userIndex = userList.IndexOf(user);
            user.Password = aSetPasswordResource.Password;
            userList[userIndex] = user;

            Database.SaveUsers(userList);

            return Ok();
		}

        //Request to add a game to a user
        [HttpPost("games/{id}")]
		public async Task<IActionResult>
		AddUserGame([FromBody] Ownership aOwnerShip)
		{
            //Query DB to get all ownerships, gather the ownership ID:s and verify that no duplicate ownership already exsists
			var ownerships = (await Database.Ownerships())
				.ToList();

			var ownershipsIds = ownerships
				.Select(o => o.OwnershipId)
				.ToList();
			
			var duplicategames = (await Database.Ownerships())
				.Where(o => o.GameId == aOwnerShip.GameId && o.UserAccountId == aOwnerShip.UserAccountId && o.State == OwnershipState.Owned)
				.FirstOrDefault();

			if (duplicategames != null)
				return Unauthorized("User already owns game");
            
            //Query the DB after user given from payload, to verify that it exsists

			var user = (await Database.Users())
				.Where(g => g.UserAccountId == aOwnerShip.UserAccountId)
				.FirstOrDefault();
            
            if (user == null)
				return BadRequest("User does not exsist");
			
            //Calculate user age to verify that he is not under the age restriction defined by the game
			var userAge =  DateTime.Now.Year - Convert.ToDateTime(user.DateOfBirth).Year; 

			var game = (await Database.Games())
				.Where(g => g.GameId == aOwnerShip.GameId)
				.FirstOrDefault();

			if (game == null)
				return BadRequest("Game does not exsist");
			
			if ((game.AgeRestriction - userAge) >= 0 )
				return Unauthorized("Users age is below age restriction");

            //Generate a unique ownership ID by looking for the max value in current DB and then adds 1.
			var uniqueOwnershipId = ownershipsIds.Max() + 1;
			
            //Generate registration Date, assign ownership state and give the new unique ID. Then saves to DB
			aOwnerShip.OwnershipId = uniqueOwnershipId;
			aOwnerShip.State = OwnershipState.Owned;
			aOwnerShip.RegisteredDate = DateTime.Now.ToString(); 

			ownerships.Add(aOwnerShip);

			Database.SaveOwnership(ownerships);
				
			return Ok();
		}

        //Request to revoke ownership of a game
        [HttpPut("games/{id}")]
		public async Task<IActionResult>
		revokeUserGame([FromBody] Ownership aOwnerShip)
		{   
            //Query the DB to find ownership to be revoked
            var ownerShips = (await Database.Ownerships()).ToList();
            var revokedOwnerShip = ownerShips
                .Where(o => o.GameId == aOwnerShip.GameId && o.UserAccountId == aOwnerShip.UserAccountId)
                .FirstOrDefault();

            if (revokedOwnerShip == null)
                return BadRequest("User does not own game");
            
            //If ownership is found, changes state to revoke and saved to DB
            var ownerShipIndex = ownerShips.IndexOf(revokedOwnerShip);
            
            revokedOwnerShip.State = OwnershipState.Revoked;

            ownerShips[ownerShipIndex] = revokedOwnerShip;
            
            Database.SaveOwnership(ownerShips);

            return Ok();
		}





        
    }



}