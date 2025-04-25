using dentalhub_api.Enums;
using dentalhub_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dentalhub_api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize(Policy = "UserPolicy")]
	public class TreatmentsController : ControllerBase
	{
		private readonly DentalhubContext _context;

		public TreatmentsController(DentalhubContext context)
		{
			_context = context;
		}

		public class ValidateBody
		{
			public required int studentId
			{
				get;
				set;
			}
			public required int teacherId
			{
				get;
				set;
			}
			public required List<int> answersIds
			{
				get;
				set;
			}
		}

		// GET: api/Treatments
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Treatment>>> GetTreatment()
		{
			return await _context.Treatments.ToListAsync();
		}

		// GET: api/Treatments/5
		[HttpGet("{id}")]
		public async Task<ActionResult> GetTreatment(int? id)
		{
			var treatment = await _context.Treatments
							   .Include(t => t.ChronologicalPlans)
							   .ThenInclude(p => p.LastStudentEdit)
							   .FirstOrDefaultAsync(a => a.Id == id);

			if (treatment == null)
			{
				return NotFound();
			}

			if (treatment.EndedAt != null)
			{
				return NotFound();
			}

			var chornologicalPlans = new List<object>();

			if (treatment.ChronologicalPlans != null)
			{
				chornologicalPlans = (await Task.WhenAll(treatment.ChronologicalPlans.Select(async plan =>
				{
					var mostRecentValidation = await _context.ChronologicalPlanValidations
						.Where(a => a.AttachmentId == plan.Id)
						.FirstOrDefaultAsync();

					string? statusString = mostRecentValidation != null ?
					Enum.GetName(typeof(Status), mostRecentValidation.Status != null ? mostRecentValidation.Status : Status.Espera) :
					 Enum.GetName(typeof(Status), plan?.EndedAt == null ? Status.Espera : Status.Cancelado);

					return new
					{
						plan.Id,
						plan.Content,
						plan.CreatedAt,
						plan.EndedAt,
						Status = statusString,
						Feedback = mostRecentValidation != null ? mostRecentValidation.Feedback : null,
						CurrentValidationId = mostRecentValidation != null ? mostRecentValidation.Id : null,
						LastEditName = plan.LastStudentEdit != null ? plan.LastStudentEdit.Name : null,
					};
				}))).ToList<object>();
			}

			var result = new
			{
				treatment.Id,
				treatment.PatientId,
				treatment.Name,
				treatment.CreatedAt,
				ChronologicalPlans = chornologicalPlans
			};


			return Ok(result);
		}
		[HttpGet("Patient/{id}")]
		public async Task<ActionResult<IEnumerable<Treatment>>> TreatmentsByPatient(int id)
		{
			var regularPatient = await _context.RegularPatients.FindAsync(id);
			var pediatricPatient = await _context.PediatricPatients.FindAsync(id);

			if (regularPatient == null && pediatricPatient == null)
			{
				return NotFound("Patient not found.");
			}

			var treatments = await _context.Treatments
				.Where(t => t.PatientId == id)
				.Select(t => new
				{
					t.Id,
					t.Name,
					t.CreatedAt,
					t.PatientId,
					t.EndedAt,
				})
				.ToListAsync();

			if (!treatments.Any())
			{
				return NotFound("No treatments found for the specified patient.");
			}

			return Ok(treatments);
		}

		[HttpGet("Affiliated/{id}")]
		public async Task<ActionResult<IEnumerable<Treatment>>> TreatmentsByAffiliated(int id)
		{
			var affiliated = await _context.Affiliateds.FindAsync(id);

			if (affiliated == null)
			{
				return NotFound("Affiliated not found.");
			}

			var treatments = await _context.Treatments
				.Where(t => t.Affiliateds != null && t.Affiliateds.Any(a => a.Id == affiliated.Id))
				.Select(t => new
				{
					t.Id,
					t.Name,
					t.PatientId,
					t.CreatedAt,
					t.EndedAt,
					t.Patient,
				})
				.ToListAsync();

			return Ok(treatments);
		}

		public class TreatmentBody
		{
			public required int PatientId
			{
				get;
				set;
			}
			public required int StudentId
			{
				get;
				set;
			}
			public required string Name
			{
				get;
				set;
			}
			public required bool IsApart
			{
				get;
				set;
			}
			public required DateTime CreatedAt
			{
				get;
				set;
			}
		}

		// POST: api/Treatments
		[HttpPost]
		public async Task<ActionResult<Treatment>> PostTreatment(TreatmentBody treatment)
		{
			try
			{
				var student = await _context.Affiliateds.FindAsync(treatment.StudentId);

				if (student == null)
				{
					return BadRequest("Student not found");
				}

				var mostRecentTreatment = await _context.Treatments
					.Where(t => t.PatientId == treatment.PatientId && t.EndedAt == null)
					.FirstOrDefaultAsync();

				if (mostRecentTreatment != null)
				{
					await CloseTreatment(mostRecentTreatment.Id);
				}

				var newTreatment = new Treatment
				{
					PatientId = treatment.PatientId,
					Name = treatment.Name,
					CreatedAt = treatment.CreatedAt,
				};

				_context.Treatments.Add(newTreatment);
				await _context.SaveChangesAsync();


				await _context.SaveChangesAsync();

				newTreatment.Affiliateds ??= new List<Affiliated>();
				newTreatment.Affiliateds.Add(student);

				await _context.SaveChangesAsync();

				return CreatedAtAction("GetTreatment", new { id = newTreatment.Id }, new
				{
					newTreatment.Id
				});

			}
			catch (DbUpdateException ex)
			{
				Console.WriteLine($"Database update error: {ex.Message}");
				return BadRequest("Database update error occurred.");
			}
			catch (Exception ex)
			{
				Console.WriteLine($"An error occurred: {ex.Message}");
				return StatusCode(500, "An error occurred while processing the request.");
			}
		}


		[HttpPost("{treatmentId}/Close")]
		public async Task<ActionResult> CloseTreatment(int? treatmentId)
		{
			var treatment = await _context.Treatments.Include(t => t.ChronologicalPlans).FirstOrDefaultAsync(t => t.Id == treatmentId);

			if (treatment == null)
			{
				return BadRequest("Treatment not found");
			}


			treatment.EndedAt = DateTime.UtcNow;

			var chronologicalPlanIds = treatment.ChronologicalPlans != null
				? treatment.ChronologicalPlans.Select(cp => (int?)cp.Id).ToList()
				: new List<int?>();


			var chronologicalPlansValidations = await _context.ChronologicalPlanValidations
				.Where(t => chronologicalPlanIds.Contains(t.Id) && t.Status == Enums.Status.Validando)
				.ToListAsync();


			foreach (var validation in chronologicalPlansValidations)
			{
				validation.Status = Enums.Status.Cancelado;
				validation.EndedAt = treatment.EndedAt;

			}

			await _context.SaveChangesAsync();

			var response = new { message = "Operation completed successfully" };

			return Ok(response);


		}
		private bool TreatmentExists(int? id)
		{
			return _context.Treatments.Any(e => e.Id == id);
		}
	}
}
