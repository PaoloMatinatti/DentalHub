using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class AnamneseAnswer : FormAnswer
	{
		public int? AnamneseId { get; set; }

		[ForeignKey("AnamneseId")]
		public Anamnese? Anamnese { get; set; }

		public int? ValidationId { get; set; }

		[ForeignKey("ValidationId")]
		public AnamneseValidation? Validation { get; set; }
	}
}
