using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace dentalhub_api.Models
{
	[PrimaryKey(nameof(Id))]
	public class Form
	{
		[Key]
		public int? Id { get; set; }

		public DateTime? EndedAt { get; set; }

		[Required]
		public DateTime CreatedAt { get; set; }

		public int? PatientId { get; set; }

		[ForeignKey("PatientId")]
		public Patient? Patient { get; set; }

		public ICollection<Affiliated>? Affiliateds { get; set; }
	}
}
