using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AcmeGames.Data;
using AcmeGames.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcmeGames.Controllers
{
    [Produces("application/json")]
    [Route("api/admin")]
    public class AdminsController: Controller
    {

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
        
    }
}