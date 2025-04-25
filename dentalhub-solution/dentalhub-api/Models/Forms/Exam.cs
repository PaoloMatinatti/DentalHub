using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class Exam : FormAttachment
	{
		[Required]
		public required string Content { get; set; }


		[Required]
		public required int TreatmentId { get; set; }


		[ForeignKey("TreatmentId")]
		public Treatment? Treatment { get; set; }
	}
}
