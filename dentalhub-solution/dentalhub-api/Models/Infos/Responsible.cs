using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dentalhub_api.Models
{
	public class Responsible
	{
		[Key]
		public int? ResponsibleId { get; set; }

		public required int PatientId { get; set; }
		[ForeignKey("PatientId")]
		public Patient? Patient { get; set; }

		public required int RegularPatientId { get; set; }
		[ForeignKey("RegularPatientId")]
		public RegularPatient? RegularPatient { get; set; }
	}
}
