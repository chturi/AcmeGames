using System.Collections.Generic;
using System.Threading.Tasks;
using AcmeGames.Data;
using AcmeGames.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace AcmeGames.Controllers
{
    // [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[Produces("application/json")]
	[Route("api/games")]
	public class GamesController : Controller
	{
		[HttpGet]
		public async Task<IEnumerable<Game>>
		GetGames()
		{
			var DBGames = await Database.Games();
			return DBGames;
		}


		[HttpDelete("{id}")]
		public async Task<IActionResult> 
		DeleteGame(int id)
		{
			
			var DBGames = await Database.Games();
			Database.SaveGames(DBGames.Where(g=> g.GameId != 1));
			
			return Ok(0);
		}





	}
}
