using dentalhub_api.Enums;


namespace dentalhub_api.Models
{
	public class PediatricPatient : Patient
	{
		public string? SchoolName { get; set; }

		public string? SchoolSeries { get; set; }

		public SchoolShift? SchoolShift { get; set; }
	}
}
