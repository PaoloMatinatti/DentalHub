using dentalhub_api.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace dentalhub_api.Models
{
	public class FrontDesk : User
	{
		[Required]
		public required int ClinicId { get; set; }

		[NotMapped]
		public override UserType UserType => UserType.FrontDesk;

		[Required]
		public required string Cpf { get; set; }

		[Required]
		public required string Telephone { get; set; }


		[ForeignKey("ClinicId")]
		public Clinic? Clinic { get; set; }
	}
}
