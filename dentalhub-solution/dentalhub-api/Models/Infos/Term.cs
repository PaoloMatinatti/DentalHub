using dentalhub_api.Enums;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	[PrimaryKey(nameof(Id))]
	public class Term
	{
		[Key]
		public int? Id { get; set; }

		[Required]
		public required string Name { get; set; }

		public required TermTypes Type { get; set; }

		public string? Url { get; set; }

		public bool? IsActive { get; set; }

		[Required]
		public required DateTime UpdatedAt { get; set; }

		[Required]
		public required DateTime CreatedAt { get; set; }

		public required int PatientId { get; set; }

		[ForeignKey("PatientId")]
		public Patient? Patient { get; set; }
	}
}
