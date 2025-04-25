using dentalhub_api.Enums;


namespace dentalhub_api.Models
{
	public class Admin : User
	{
		public override UserType UserType => UserType.Admin;

		public int? ID { get; set; }
		public string? Email { get; set; }
	}
}
