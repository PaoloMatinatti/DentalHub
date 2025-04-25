using dentalhub_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dentalhub_api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize(Policy = "UserPolicy")]
	public class AffiliatedsController : ControllerBase
	{
		private readonly DentalhubContext _context;

		public AffiliatedsController(DentalhubContext context)
		{
			_context = context;
		}

		// GET: api/Affiliateds
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Affiliated>>> GetAffiliateds()
		{
			return await _context.Affiliateds.ToListAsync();
		}


		// GET: api/Affiliateds/Students
		[HttpGet("Students")]
		public async Task<ActionResult<IEnumerable<Affiliated>>> GetStudents()
		{
			return await _context.Affiliateds.Where(a => a.IsTeacher == false).ToListAsync();
		}

		// GET: api/Affiliateds/Teachers
		[HttpGet("Teachers")]
		public async Task<ActionResult<IEnumerable<Affiliated>>> GetTeachers()
		{
			return await _context.Affiliateds.Where(a => a.IsTeacher == true).ToListAsync();
		}

		// GET: api/Affiliateds/5
		[HttpGet("{id}")]
		public async Task<ActionResult<Affiliated>> GetAffiliated(int? id)
		{
			var affiliated = await _context.Affiliateds.FindAsync(id);

			if (affiliated == null)
			{
				return NotFound();
			}

			if (affiliated.IsTeacher == true)
			{
				var atmValidations = await _context.AtmValidations
						.Where(t => t.TeacherId == id && t.Status == Enums.Status.Validando)
						.Select(t => new
						{
							t.Id,
							TreatmentId = t.Atm != null ? t.Atm.Id : (int?)null,
							TreatmentName = "Atm",
							AtmName = t.Atm != null ? t.Atm.Index : (string?)null,
							PatientId = t.Atm != null ? t.Atm.PatientId : (int?)null,
							PatientName = t.Atm != null ? (t.Atm.Patient != null ? t.Atm.Patient.Name : null) : null,
							t.Status,
							t.CreatedAt
						})
						.ToListAsync();

				var drawValidations = await _context.PainDrawValidations
					.Where(t => t.TeacherId == id && t.Status == Enums.Status.Validando)
					.Select(t => new
					{
						t.Id,
						TreatmentName = "Desenho de Dor",
						TreatmentId = t.Attachment != null ? t.Attachment.AtmId : (int?)null,
						PatientId = t.Attachment != null && t.Attachment.Atm != null ? t.Attachment.Atm.PatientId : (int?)null,
						PatientName = t.Attachment != null && t.Attachment.Atm != null && t.Attachment.Atm.Patient != null ? t.Attachment.Atm.Patient.Name : null,
						t.Status,
						t.CreatedAt
					})
					.ToListAsync();


				var screeningValidations = await _context.ScreeningValidations
					.Where(t => t.TeacherId == id && t.Status == Enums.Status.Validando)
					.Select(t => new
					{
						t.Id,
						TreatmentId = t.Screening != null ? t.Screening.Id : (int?)null,
						TreatmentName = "Triagem",
						PatientId = t.Screening != null ? t.Screening.PatientId : (int?)null,
						PatientName = t.Screening != null ? (t.Screening.Patient != null ? t.Screening.Patient.Name : null) : null,
						t.Status,
						t.CreatedAt
					})
					.ToListAsync();


				var chartsValidations = await _context.PeriodontalChartValidations
						.Where(t => t.TeacherId == id && t.Status == Enums.Status.Validando)
						.Select(t => new
						{
							t.Id,
							TreatmentId = t.Attachment != null ? t.Attachment.Id : (int?)null,
							TreatmentName = "Mapa Periodontal",
							ChartName = t.Attachment != null ? t.Attachment.CreatedAt.ToString() : (string?)null,
							PatientId = t.Attachment != null ? t.Attachment.PatientId : (int?)null,
							PatientName = t.Attachment != null ? (t.Attachment.Patient != null ? t.Attachment.Patient.Name : null) : null,
							t.Status,
							t.CreatedAt
						})
						.ToListAsync();

				var anamneseValidations = await _context.AnamneseValidations
					.Where(t => t.TeacherId == id && t.Status == Enums.Status.Validando)
					.Select(t => new
					{
						t.Id,
						TreatmentId = t.Anamnese != null ? t.Anamnese.Id : (int?)null,
						TreatmentName = "Anamnese",
						PatientId = t.Anamnese != null ? t.Anamnese.PatientId : (int?)null,
						PatientName = t.Anamnese != null ? (t.Anamnese.Patient != null ? t.Anamnese.Patient.Name : null) : null,
						t.Status,
						t.CreatedAt
					})
					.ToListAsync();

				var chronologicalPlansValidations = await _context.ChronologicalPlanValidations
					.Where(t => t.TeacherId == id && t.Status == Enums.Status.Validando)
					.Select(t => new
					{
						t.Id,
						TreatmentName = "Plano Cronológico",
						TreatmentId = t.Attachment != null ? t.Attachment.TreatmentId : (int?)null,
						PatientId = t.Attachment != null && t.Attachment.Treatment != null ? t.Attachment.Treatment.PatientId : (int?)null,
						PatientName = t.Attachment != null && t.Attachment.Treatment != null && t.Attachment.Treatment.Patient != null ? t.Attachment.Treatment.Patient.Name : null,
						t.Status,
						t.CreatedAt
					})
					.ToListAsync();

				List<object> validations = new List<object>();

				validations.AddRange(screeningValidations);
				validations.AddRange(atmValidations);
				validations.AddRange(anamneseValidations);
				validations.AddRange(chronologicalPlansValidations);
				validations.AddRange(chartsValidations);
				validations.AddRange(drawValidations);

				var result = new
				{
					affiliated.Name,
					affiliated.Cpf,
					affiliated.IsTeacher,
					affiliated.Telephone,
					affiliated.Email,
					affiliated.Registry,
					affiliated.UserType,
					affiliated.CreatedAt,
					Validations = validations,
				};


				return Ok(result);
			}

			return affiliated;
		}

		// PUT: api/Affiliateds/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut("{id}")]
		public async Task<IActionResult> PutAffiliated(int? id, Affiliated affiliated)
		{
			if (id != affiliated.Id)
			{
				return BadRequest();
			}

			_context.Entry(affiliated).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!AffiliatedExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return NoContent();
		}
		private bool AffiliatedExists(int? id)
		{
			return _context.Affiliateds.Any(e => e.Id == id);
		}
	}
}
