using System.Collections.Generic;
using System.Threading.Tasks;
using AcmeGames.Data;
using AcmeGames.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System;
using System.Security.Claims;
using System.Net;

namespace AcmeGames.Controllers
{
	//GamesController, relates api calls for games, not very sensitive information and bother users and admins can access
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[Produces("application/json")]
	[Route("api/games")]
	public class GamesController : Controller
	{
		//Request to get all games in DB
		[HttpGet]
		public async Task<IEnumerable<Game>>
		GetGames()
		{
			return await Database.Games();;
		}

		//Request to get all users currently owned games, exludes revoked games
		[HttpGet("{id}")]
		public async Task<IEnumerable<Game>>
		GetUserGames(string id)
		{
			//Query the DB to get the IDs of owned games with a specific userAccountID
			var ownedGameIds = (await Database.Ownerships())
				.Where(o => o.UserAccountId == id && o.State == OwnershipState.Owned)
				.Select(g => g.GameId)
				.ToList();

			//Query the game table with game IDs from ownerships
			var userGames = (await Database.Games())
				.Where(g => ownedGameIds.Contains(g.GameId));
				
			return userGames;
		}

		//Add game to user by adding a new ownership
		[HttpPost]
		public async Task<IActionResult>
		AddUserGame([FromBody] Ownership aOwnerShip)
		{
			//save ownership and ownership ids to lists and verify that no duplicate ownerships with state OWNED exsists
			var ownerships = (await Database.Ownerships())
				.ToList();

			var ownershipsIds = ownerships
				.Select(o => o.OwnershipId)
				.ToList();
			
			var duplicategames = ownerships
				.Where(o => o.GameId == aOwnerShip.GameId && o.UserAccountId == aOwnerShip.UserAccountId && o.State == OwnershipState.Owned)
				.FirstOrDefault();

			if (duplicategames != null)
				return Unauthorized("User already owns game");

			//Use the ownership ID list to look for max and add 1 to generate a unique ID, follow by updating DATE, STATE and saving the ownership to the DB
			var uniqueOwnershipId = ownershipsIds.Max() + 1;
			
			aOwnerShip.OwnershipId = uniqueOwnershipId;
			aOwnerShip.State = OwnershipState.Owned;
			aOwnerShip.RegisteredDate = DateTime.Now.ToString(); 

			ownerships.Add(aOwnerShip);

			Database.SaveOwnership(ownerships);
				
			return Ok();
		}

		//Request to redeem game key
		[HttpPut("redeem-key/{id}")]
		public async Task<IActionResult>
		RedeemUserKey(string id) 
		{
			//See if the key from pay load is present in the DB or is already redeemed
			var key = (await Database.GameKeys())
				.Where(k => k.Key == id)
				.FirstOrDefault();

			if (key == null)
				return Unauthorized("Invalid Key");
			
			if (key.IsRedeemed)
				return Unauthorized("Key has already been redeemed");
			
			//get user ID and date of birth from claims
			var identity = HttpContext.User.Identity as ClaimsIdentity;

			var userAccountId = identity.Claims
				.Where(c => c.Type == ClaimTypes.NameIdentifier)
				.FirstOrDefault()
				.Value;

			var userDateOfBirth = identity.Claims
				.Where(c => c.Type == ClaimTypes.DateOfBirth)
				.FirstOrDefault()
				.Value;
			
			var userAge =   DateTime.Now.Year - Convert.ToDateTime(userDateOfBirth).Year; 

			var game = (await Database.Games())
				.Where(g => g.GameId == key.GameId)
				.FirstOrDefault();

			//User age is used to verify that the user is above game age restriction, also verify that the game exsists
			if (game == null)
				return BadRequest("Game does not exsist");
			
			if ((game.AgeRestriction - userAge) >= 0 )
				return Unauthorized("Users age is below age restriction");

			//With the data, generate an ownership and call the AddUserGame method to generate a new ownership
			var aOwnerShip = new Ownership{
				GameId = key.GameId,
				UserAccountId = userAccountId
			};
			
			var addOwnershipResponse = await AddUserGame(aOwnerShip);

			var httpResponseCode = (int)addOwnershipResponse
				.GetType()
                .GetProperty("StatusCode")
                .GetValue(addOwnershipResponse, null);

			//If new ownership is confirmed the key is updated to status redeemed and saved to DB
			if(httpResponseCode == 200) 
			{
				var keys = (await Database.GameKeys())
				.ToList();

				var keyIndex = keys.IndexOf(key);

				key.IsRedeemed = true;

				keys[keyIndex] = key;

				Database.SaveGameKeys(keys);
			}
				
				
				
			return addOwnershipResponse;
		
		}

		




		
	}
}
