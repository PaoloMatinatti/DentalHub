using dentalhub_api.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class PainDrawValidation : FormValidation
	{
		public required AttachmentTypes Type { get; set; }

		public DateTime? EndedAt { get; set; }

		[Required]
		public int AttachmentId { get; set; }

		[ForeignKey("AttachmentId")]
		public PainDraw? Attachment { get; set; }
	}
}
