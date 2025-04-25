namespace dentalhub_api.Models
{
	public class Treatment : Form
	{
		public string? Name { get; set; }
		public ICollection<Exam>? Exams { get; set; }
		public ICollection<ChronologicalPlan>? ChronologicalPlans { get; set; }
	}
}
