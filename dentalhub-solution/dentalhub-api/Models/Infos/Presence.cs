using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace dentalhub_api.Models
{
	[PrimaryKey(nameof(Id))]
	public class Presence
	{
		[Key]
		public int? Id { get; set; }

		public bool? IsEmergency { get; set; }

		[Required]
		public required int ClinicId { get; set; }

		[Required]
		public required int PatientId { get; set; }

		[Required]
		public required int FrontdeskId { get; set; }

		[Required]
		public DateTime UpdatedAt { get; set; }

		[Required]
		public DateTime CreatedAt { get; set; }

		public DateTime? Exit { get; set; }

		[ForeignKey("ClinicId")]
		public Clinic? Clinic { get; set; }

		[ForeignKey("PatientId")]
		public Patient? Patient { get; set; }


		[ForeignKey("FrontdeskId")]
		public FrontDesk? FrontDesk { get; set; }

	}
}
