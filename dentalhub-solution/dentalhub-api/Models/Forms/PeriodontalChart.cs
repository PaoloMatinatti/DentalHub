using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace dentalhub_api.Models
{
	public class PeriodontalChart : FormAttachment
	{
		[Required]
		public required string Url { get; set; }

		public int? PatientId { get; set; }

		[ForeignKey("PatientId")]
		public Patient? Patient { get; set; }
	}
}
