using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class PainDraw : FormAttachment
	{
		[Required]
		public required string Url { get; set; }


		[Required]
		public required int AtmId { get; set; }


		[ForeignKey("AtmId")]
		public Atm? Atm { get; set; }
	}
}
