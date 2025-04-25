using dentalhub_api.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace dentalhub_api.Models
{
	public class Address
	{
		[Key]
		public int? Id { get; set; }

		[Required]
		public Uf Uf { get; set; }

		[Required]
		public required string Number { get; set; }

		public string? Cep { get; set; }

		[Required]
		public required string Telephone { get; set; }

		[Required]
		public required string District { get; set; }

		[Required]
		public required string City { get; set; }

		[Required]
		public required string Street { get; set; }

		public DateTime? UpdatedAt { get; set; }
		public DateTime? CreatedAt { get; set; }

		[JsonIgnore]
		public ICollection<Patient>? Patients { get; set; }
	}
}
