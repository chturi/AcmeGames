namespace AcmeGames.Resources
{
    //resource to hand payload when user wants to change email
    public class SetEmailResource
    {
        public string UserAccountId {get; set;}
        public string Password {get; set;}
        public string EmailAddress {get; set;}
        
    }
}