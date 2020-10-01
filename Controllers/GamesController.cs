using System.Collections.Generic;
using AcmeGames.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcmeGames.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[Produces("application/json")]
	[Route("api/games")]
	public class GamesController : Controller
	{
		[HttpGet]
		public IEnumerable<Game>
		GetAllGames()
		{
			return new[]
			{
				new Game
				{
					AgeRestriction = 16,
					GameId = 1,
					Name = "Tom Clancy's Rainbow Six® Siege",
					Thumbnail = "https://ubistatic3-a.akamaihd.net/orbit/uplay_launcher_3_0/assets/ce92dd05207a67d81bb6a3df7bf004c3.jpg"
				}
			};
		}
	}
}
