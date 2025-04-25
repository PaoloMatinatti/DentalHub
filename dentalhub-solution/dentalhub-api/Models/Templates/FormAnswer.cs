using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace dentalhub_api.Models
{
	[PrimaryKey(nameof(Id))]
	public class FormAnswer
	{
		[Key]
		public int? Id { get; set; }

		public string? Question { get; set; }
		public string? Content { get; set; }
		public bool? Highlight { get; set; }

		[Required]
		public DateTime CreatedAt { get; set; }
	}
}
