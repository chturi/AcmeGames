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
    [Produces("application/json")]
    [Route("api/admin")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles ="Admin")]
    public class AdminsController: Controller
    {

        
        [HttpGet("users")]
		public async Task<IEnumerable<User>>
		GetUsers()
		{
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


        [HttpPut("users/{id}")]
		public async Task<IActionResult>
		UpdateUser(string id, [FromBody] UpdateUserAdminResource aUser)
		{
            var userList = (await Database.Users()).ToList();
            var user = (await Database.Users())
                .Where(u => u.UserAccountId == id)
                .FirstOrDefault();
            
            if (user == null)
                return BadRequest("User not found");

            var duplicateEmail = userList
                .Where(u => u.EmailAddress == aUser.EmailAddress && u.UserAccountId != aUser.UserAccountId)
                .FirstOrDefault();
            
            if (duplicateEmail != null)
                return Unauthorized("Email is already in use");

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

         [HttpPut("set-password/{id}")]
		public async Task<IActionResult>
		resetPassword(string id, [FromBody] SetPasswordResource aSetPasswordResource)
		{
            
            var userList = (await Database.Users()).ToList();
            var user = (await Database.Users())
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

        [HttpPost("games/{id}")]
		public async Task<IActionResult>
		AddUserGame([FromBody] Ownership aOwnerShip)
		{
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
            
            var userAccountId = aOwnerShip.UserAccountId;

			var user = (await Database.Users())
				.Where(g => g.UserAccountId == aOwnerShip.UserAccountId)
				.FirstOrDefault();
            
            if (user == null)
				return BadRequest("User does not exsist");
			
			var userAge =  DateTime.Now.Year - Convert.ToDateTime(user.DateOfBirth).Year; 

			var game = (await Database.Games())
				.Where(g => g.GameId == aOwnerShip.GameId)
				.FirstOrDefault();

			if (game == null)
				return BadRequest("Game does not exsist");
			
			if ((game.AgeRestriction - userAge) >= 0 )
				return Unauthorized("Users age is below age restriction");


			var uniqueOwnershipId = ownershipsIds.Max() + 1;
			
			aOwnerShip.OwnershipId = uniqueOwnershipId;
			aOwnerShip.State = OwnershipState.Owned;
			aOwnerShip.RegisteredDate = DateTime.Now.ToString(); 

			ownerships.Add(aOwnerShip);

			Database.SaveOwnership(ownerships);
				
			return Ok();
		}

        [HttpPut("games/{id}")]
		public async Task<IActionResult>
		revokeUserGame([FromBody] Ownership aOwnerShip)
		{
            var ownerShips = (await Database.Ownerships()).ToList();
            var revokedOwnerShip = ownerShips
                .Where(o => o.GameId == aOwnerShip.GameId && o.UserAccountId == aOwnerShip.UserAccountId)
                .FirstOrDefault();

            if (revokedOwnerShip == null)
                return BadRequest("User does not own game");
            
            var ownerShipIndex = ownerShips.IndexOf(revokedOwnerShip);
            
            revokedOwnerShip.State = OwnershipState.Revoked;

            ownerShips[ownerShipIndex] = revokedOwnerShip;
            
            Database.SaveOwnership(ownerShips);

            return Ok();
		}





        
    }



}