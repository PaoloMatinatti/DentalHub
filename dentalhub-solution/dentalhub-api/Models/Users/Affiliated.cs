using dentalhub_api.Enums;
using System.ComponentModel.DataAnnotations.Schema;


namespace dentalhub_api.Models
{
	public class Affiliated : User
	{
		[NotMapped]
		public override UserType UserType => IsTeacher ?? false ? UserType.Teacher : UserType.Student;

		public required string? Email { get; set; }
		public required string? Telephone { get; set; }
		public required string? Registry { get; set; }
		public required string? Cpf { get; set; }
		public required bool? IsTeacher { get; set; }
	}
}



