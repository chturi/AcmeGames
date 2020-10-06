namespace AcmeGames.Resources
{
    //Custom password resource used to hand payload from user who want to change password
    public class SetPasswordResource
    {
        public string UserAccountId {get; set;}
        public string CurrentPassword {get; set;}
        public string Password {get; set;}
       
    }
}