using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class AtmAnswer : FormAnswer
	{
		public int? AtmId { get; set; }

		[ForeignKey("AtmId")]
		public Atm? Atm { get; set; }

		public int? ValidationId { get; set; }

		[ForeignKey("ValidationId")]
		public AtmValidation? Validation { get; set; }
	}
}
