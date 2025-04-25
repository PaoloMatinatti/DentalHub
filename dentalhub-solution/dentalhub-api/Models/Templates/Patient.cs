using dentalhub_api.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace dentalhub_api.Models
{
	public class Patient : User
	{

		[NotMapped]
		public override UserType UserType => UserType.Patient;
		public string? Token { get; set; }
		[Required]
		public required DateTime BirthDate { get; set; }

		public bool? IsDependent { get; set; }
		public string? SusRegionalCard { get; set; }
		public string? SusNationalCard { get; set; }
		public string? Nationality { get; set; }
		public Gender Gender { get; set; }
		public EthnicGroup EthnicGroup { get; set; }
		public int? AddressId { get; set; }

		[ForeignKey("AddressId")]
		public Address? Address { get; set; }


		public ICollection<Term>? Terms { get; set; }
		public ICollection<Atm>? Atms { get; set; }
		public ICollection<PeriodontalChart>? PeriodontalCharts { get; set; }
		public ICollection<Treatment>? Treatments { get; set; }
		public ICollection<Anamnese>? Anamneses { get; set; }
		public ICollection<Screening>? Screenings { get; set; }
		public ICollection<Responsible>? Responsible { get; set; }
	}
}
