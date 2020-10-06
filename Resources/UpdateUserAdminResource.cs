using System;

namespace AcmeGames.Resources
{
	//Resource with role for parsing data when Admin wants to change user information from the admin-console
    public class UpdateUserAdminResource
    {
        public string	UserAccountId { get; set; }
	    public string	FirstName { get; set; }
	    public string	LastName { get; set; }
	    public string   FullName => $"{FirstName} {LastName}";
	    public DateTime	DateOfBirth { get; set; }
	    public string	EmailAddress { get; set; }
	    public string	Password { get; set; }
	    public bool		IsAdmin { get; set; }
        public string	Role { get; set; }
    }
}