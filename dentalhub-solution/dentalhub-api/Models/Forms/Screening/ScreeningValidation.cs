using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class ScreeningValidation : FormValidation
	{
		public ICollection<ScreeningAnswer>? Answers { get; set; }
		public int ScreeningId { get; set; }

		[ForeignKey("ScreeningId")]
		public Screening? Screening { get; set; }
	}
}
