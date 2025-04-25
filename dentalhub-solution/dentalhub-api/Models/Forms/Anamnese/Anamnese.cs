using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class Anamnese : Form
	{
		public string? Index { get; set; }
		public int? CurrentValidationId { get; set; }

		[ForeignKey("CurrentValidationId")]
		public AnamneseValidation? CurrentValidation { get; set; }

		public ICollection<AnamneseValidation>? Validations { get; set; }
	}
}
