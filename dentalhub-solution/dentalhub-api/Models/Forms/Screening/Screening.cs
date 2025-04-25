using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class Screening : Form
	{
		public string? Index { get; set; }
		public int? CurrentValidationId { get; set; }

		[ForeignKey("CurrentValidationId")]
		public ScreeningValidation? CurrentValidation { get; set; }

		public ICollection<ScreeningValidation>? Validations { get; set; }
	}
}
