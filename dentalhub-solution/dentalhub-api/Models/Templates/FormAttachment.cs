using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class FormAttachment
	{
		[Key]
		public int? Id { get; set; }

		[Required]
		public required DateTime UpdatedAt { get; set; }

		[Required]
		public required DateTime CreatedAt { get; set; }

		public DateTime? EndedAt { get; set; }

		public required int LastStudentEditId { get; set; }

		[ForeignKey("LastStudentEditId")]
		public Affiliated? LastStudentEdit { get; set; }
	}
}
