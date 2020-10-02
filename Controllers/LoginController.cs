﻿using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AcmeGames.Data;
using AcmeGames.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Linq;

namespace AcmeGames.Controllers
{
    [Produces("application/json")]
    [Route("api/login")]
    public class LoginController : Controller
    {
        private readonly SigningCredentials     mySigningCredentials;

        public LoginController(
            IConfiguration          aConfiguration)
        {
            if (aConfiguration == null)
            {
                throw new ArgumentNullException(nameof(aConfiguration));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(aConfiguration["JWTKey"]));
            mySigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        }

        [HttpPost]
        public async Task<IActionResult>
        Authenticate(
            [FromBody] AuthRequest  aAuthRequest)
        {
            // Implement: Retrieve a user account from the database and handle invalid login attempts
           var user = (await Database.Users())
            .Where(u => u.EmailAddress == aAuthRequest.EmailAddress)
            .FirstOrDefault(); 
           
            if (user == null)
                return BadRequest("Username does not exist!");
        
            var isPasswordMatch = (user.Password == aAuthRequest.Password) ? true : false;

            if (isPasswordMatch) {
                
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier,    user.UserAccountId),
                    new Claim(ClaimTypes.Name,              user.FullName),
                    new Claim(ClaimTypes.GivenName,         user.FirstName),
                    new Claim(ClaimTypes.Surname,           user.LastName), 
                    new Claim(ClaimTypes.DateOfBirth,       user.DateOfBirth.ToString("yyyy-MM-dd")),
                    new Claim(ClaimTypes.Email,             user.EmailAddress),
                    new Claim(ClaimTypes.Role,              user.IsAdmin ? "Admin" : "User")
                };

                var token = new JwtSecurityToken(
                    "localhost:5001",
                    "localhost:5001",
                    claims,
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: mySigningCredentials);

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token)
                });
            
            }

            return Unauthorized();
        }
    }
}