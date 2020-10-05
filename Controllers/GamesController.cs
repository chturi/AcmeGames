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
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[Produces("application/json")]
	[Route("api/games")]
	public class GamesController : Controller
	{
		[HttpGet]
		public async Task<IEnumerable<Game>>
		GetGames()
		{
			return await Database.Games();;
		}

		[HttpGet("{id}")]
		public async Task<IEnumerable<Game>>
		GetUserGames(string id)
		{
			var ownedGameIds = (await Database.Ownerships())
				.Where(o => o.UserAccountId == id)
				.Select(g => g.GameId)
				.ToList();

			var userGames = (await Database.Games())
				.Where(g => ownedGameIds.Contains(g.GameId));
				
			return userGames;
		}

		[HttpDelete("byId")]
		public async Task<IActionResult>
		DeleteUserGame(string userAccountId, uint gameId)
		{
			var newOwnerShip = (await Database.Ownerships())
				.Where(o => o.UserAccountId != userAccountId && o.GameId != gameId)
				.ToList();
			
			Database.SaveOwnership(newOwnerShip);
				
			return Ok(newOwnerShip);
		}

		[HttpPost]
		public async Task<IActionResult>
		AddUserGame([FromBody] Ownership aOwnerShip)
		{
			var ownerships = (await Database.Ownerships())
				.ToList();

			var ownershipsIds = (await Database.Ownerships())
				.Select(o => o.OwnershipId)
				.ToList();
			
			var duplicategames = (await Database.Ownerships())
				.Where(o => o.GameId == aOwnerShip.GameId && o.UserAccountId == aOwnerShip.UserAccountId)
				.FirstOrDefault();

			if (duplicategames != null)
				return Unauthorized("User already owns game");

			var uniqueOwnershipId = ownershipsIds.Max() + 1;
			
			aOwnerShip.OwnershipId = uniqueOwnershipId;
			aOwnerShip.State = 0;
			aOwnerShip.RegisteredDate = DateTime.Now.ToString(); 

			ownerships.Add(aOwnerShip);

			Database.SaveOwnership(ownerships);
				
			return Ok();
		}

		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[HttpPut("redeem-key/{id}")]
		public async Task<IActionResult>
		RedeemUserKey(string id) 
		{
			var key = (await Database.GameKeys())
				.Where(k => k.Key == id)
				.FirstOrDefault();

			if (key == null)
				return Unauthorized("Invalid Key");
			
			if (key.IsRedeemed)
				return Unauthorized("Key has already been redeemed");
			

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

			if (game == null)
				return BadRequest("Game does not exsist");
			
			if ((game.AgeRestriction - userAge) >= 0 )
				return Unauthorized("Users age is below age restriction");

			var aOwnerShip = new Ownership{
				GameId = key.GameId,
				UserAccountId = userAccountId
			};
			
			var addOwnershipResponse = await AddUserGame(aOwnerShip);

			var httpResponseCode = (int)addOwnershipResponse
				.GetType()
                .GetProperty("StatusCode")
                .GetValue(addOwnershipResponse, null);

			if(httpResponseCode == 200) 
			{
				var keys = (await Database.GameKeys())
				.Where(k => k.Key == id)
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
