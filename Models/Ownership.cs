namespace AcmeGames.Models
{
	public class Ownership
	{
		public uint				GameId { get; set; }
		public uint				OwnershipId { get; set; }
		public string			RegisteredDate { get; set; }
		public OwnershipState	State { get; set; }
		public string			UserAccountId { get; set; }
	}
}
