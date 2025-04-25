using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace dentalhub_api.Models
{
	[PrimaryKey(nameof(Id))]
	public class Clinic
	{
		[Required]
		public required int Id { get; set; }

		[Required]
		public required string Name { get; set; }

		[Required]
		public required DateTime UpdatedAt { get; set; }

		[Required]
		public required DateTime CreatedAt { get; set; }
	}
}
