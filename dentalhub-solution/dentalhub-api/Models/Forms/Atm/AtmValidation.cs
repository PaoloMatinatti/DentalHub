using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class AtmValidation : FormValidation
	{
		public ICollection<AtmAnswer>? Answers { get; set; }
		public int AtmId { get; set; }

		[ForeignKey("AtmId")]
		public Atm? Atm { get; set; }
	}
}
