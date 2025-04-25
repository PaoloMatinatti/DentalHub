using dentalhub_api.Enums;
using System.ComponentModel.DataAnnotations.Schema;


namespace dentalhub_api.Models
{
	public class RegularPatient : Patient
	{

		public string? Occupation { get; set; }

		public string? Email { get; set; }

		public string? Phone { get; set; }

		public string? ExpeditionRG { get; set; }

		public string? Rg { get; set; }

		public CivilStatus CivilStatus { get; set; }

		public string? Cpf { get; set; }

		public string? Recommendation { get; set; }

		public string? FatherName { get; set; }

		public string? MotherName { get; set; }

		public int? ComercialAddressId { get; set; }

		[ForeignKey("ComercialAddressId")]
		public Address? ComercialAddress { get; set; }

	}
}
