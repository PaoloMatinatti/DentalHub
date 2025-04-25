using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class Atm : Form
	{
		public string? Index { get; set; }
		public int? CurrentValidationId { get; set; }

		[ForeignKey("CurrentValidationId")]
		public AtmValidation? CurrentValidation { get; set; }

		public ICollection<AtmValidation>? Validations { get; set; }
		public ICollection<PainDraw>? PainDraws { get; set; }

	}
}
