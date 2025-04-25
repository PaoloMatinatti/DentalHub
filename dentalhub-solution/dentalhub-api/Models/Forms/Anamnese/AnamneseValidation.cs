using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class AnamneseValidation : FormValidation
	{
		public ICollection<AnamneseAnswer>? Answers { get; set; }
		public int AnamneseId { get; set; }

		[ForeignKey("AnamneseId")]
		public Anamnese? Anamnese { get; set; }
	}
}
