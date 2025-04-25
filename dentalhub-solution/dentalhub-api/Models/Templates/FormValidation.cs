using dentalhub_api.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class FormValidation
	{
		[Key]
		public int? Id { get; set; }
		public Status? Status { get; set; }

		public string? Feedback { get; set; }

		public required int TeacherId { get; set; }
		public required int StudentId { get; set; }

		[Required]
		public DateTime CreatedAt { get; set; }

		[ForeignKey("TeacherId")]
		public Affiliated? Teacher { get; set; }

		[ForeignKey("StudentId")]
		public Affiliated? Student { get; set; }

	}
}
