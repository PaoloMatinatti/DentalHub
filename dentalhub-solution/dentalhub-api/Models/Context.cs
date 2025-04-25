using Microsoft.EntityFrameworkCore;

namespace dentalhub_api.Models
{
	public class DentalhubContext : DbContext
	{
		private readonly IConfiguration _configuration;

		public DentalhubContext(IConfiguration configuration)
		{
			_configuration = configuration;
		}


		public DbSet<Treatment> Treatments { get; set; }

		public DbSet<Anamnese> Anamneses { get; set; }
		public DbSet<AnamneseAnswer> AnamneseAnswers { get; set; }
		public DbSet<AnamneseValidation> AnamneseValidations { get; set; }

		public DbSet<Screening> Screenings { get; set; }
		public DbSet<ScreeningAnswer> ScreeningAnswers { get; set; }
		public DbSet<ScreeningValidation> ScreeningValidations { get; set; }

		public DbSet<Atm> Atms { get; set; }
		public DbSet<AtmAnswer> AtmAnswers { get; set; }
		public DbSet<AtmValidation> AtmValidations { get; set; }

		public DbSet<ChronologicalPlan> ChronologicalPlans { get; set; }
		public DbSet<ChronologicalPlanValidation> ChronologicalPlanValidations { get; set; }
		public DbSet<PainDraw> PainDraws { get; set; }
		public DbSet<PainDrawValidation> PainDrawValidations { get; set; }
		public DbSet<PeriodontalChart> PeriodontalCharts { get; set; }
		public DbSet<PeriodontalChartValidation> PeriodontalChartValidations { get; set; }
		public DbSet<Exam> Exams { get; set; }



		public DbSet<RegularPatient> RegularPatients { get; set; }
		public DbSet<PediatricPatient> PediatricPatients { get; set; }
		public DbSet<Address> Addresses { get; set; }
		public DbSet<Term> Terms { get; set; }


		public DbSet<Affiliated> Affiliateds { get; set; }
		public DbSet<Responsible> Responsibles { get; set; }
		public DbSet<FrontDesk> FrontDesks { get; set; }
		public DbSet<Admin> Admins { get; set; }

		public DbSet<Clinic> Clinics { get; set; }
		public DbSet<Presence> Presences { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Anamnese>()
			.HasMany(a => a.Validations)
			.WithOne(v => v.Anamnese)
			.HasForeignKey(v => v.AnamneseId)
			.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Anamnese>()
			.HasOne(a => a.CurrentValidation)
			.WithMany()
			.HasForeignKey(a => a.CurrentValidationId)
			.OnDelete(DeleteBehavior.Restrict);


			modelBuilder.Entity<Screening>()
			.HasMany(a => a.Validations)
			.WithOne(v => v.Screening)
			.HasForeignKey(v => v.ScreeningId)
			.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Screening>()
			.HasOne(a => a.CurrentValidation)
			.WithMany()
			.HasForeignKey(a => a.CurrentValidationId)
			.OnDelete(DeleteBehavior.Restrict);


			modelBuilder.Entity<Atm>()
			.HasMany(a => a.Validations)
			.WithOne(v => v.Atm)
			.HasForeignKey(v => v.AtmId)
			.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Atm>()
			.HasOne(a => a.CurrentValidation)
			.WithMany()
			.HasForeignKey(a => a.CurrentValidationId)
			.OnDelete(DeleteBehavior.Restrict);
		}


		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			optionsBuilder.UseNpgsql(_configuration.GetConnectionString("DefaultConnection"));
		}
	}
}
