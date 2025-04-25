using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class ScreeningAnswer : FormAnswer
	{
		public int? ScreeningId { get; set; }

		[ForeignKey("ScreeningId")]
		public Screening? Screening { get; set; }

		public int? ValidationId { get; set; }

		[ForeignKey("ValidationId")]
		public ScreeningValidation? Validation { get; set; }
	}
}
