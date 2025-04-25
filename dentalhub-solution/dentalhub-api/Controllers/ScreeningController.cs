using dentalhub_api.Enums;
using dentalhub_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace dentalhub_api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ScreeningController : ControllerBase
	{
		private readonly DentalhubContext _context;

		public ScreeningController(DentalhubContext context)
		{
			_context = context;
		}

		// GET: api/Screening
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Screening>>> GetScreenings()
		{
			return await _context.Screenings.ToListAsync();
		}

		// GET: api/Screening/5
		[HttpGet("{id}")]
		public async Task<ActionResult> GetScreening(int id)
		{
			var screening = await _context.Screenings
				.Include(a => a.CurrentValidation)
				.FirstOrDefaultAsync(a => a.Id == id);


			if (screening == null)
			{
				return NotFound();
			}

			List<ScreeningAnswer>? answers = null;

			if (screening.CurrentValidation != null && screening.CurrentValidation.Answers is ICollection<ScreeningAnswer> treatmentAnswers)
			{
				answers = treatmentAnswers.Select(t => new ScreeningAnswer
				{
					Id = t.Id,
					ScreeningId = t.ScreeningId,
					Content = t.Content,
					Question = t.Question,
				}).ToList();
			}
			else
			{
				var allAnswers = await _context.ScreeningAnswers
							.Where(a => a.ScreeningId == id)
							.ToListAsync();

				var mostRecentAnswers = allAnswers
					.GroupBy(a => a.Question)
					.Select(g => g.OrderByDescending(a => a.CreatedAt).First())
					.ToList();

				answers = mostRecentAnswers
				   .Select(t => new ScreeningAnswer
				   {
					   Id = t.Id,
					   ScreeningId = t.ScreeningId,
					   ValidationId = t.ValidationId,
					   Content = t.Content,
					   Question = t.Question,
				   })
				   .ToList();
			}

			string? statusString = screening.CurrentValidation != null ?
				Enum.GetName(typeof(Status), screening.CurrentValidation.Status) :
				null;


			var result = new
			{
				screening.Id,
				screening.PatientId,
				screening.CurrentValidationId,
				screening.Index,
				screening.CreatedAt,
				Status = statusString,
				Feedback = screening.CurrentValidation != null ? screening.CurrentValidation.Feedback : null,
				Answers = answers
			};

			return Ok(result);
		}

		public class ScreeningBody
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
			public required string Index
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

		// POST: api/Screening
		[HttpPost]
		public async Task<ActionResult<Screening>> PostScreening(ScreeningBody screening)
		{
			var student = await _context.Affiliateds.FindAsync(screening.StudentId);
			if (student == null)
			{
				return BadRequest("Student not found");
			}

			var mostRecentScreening = await _context.Screenings
				.Where(t => t.PatientId == screening.PatientId && t.EndedAt == null)
				.FirstOrDefaultAsync();

			if (mostRecentScreening != null)
			{
				mostRecentScreening.EndedAt = DateTime.UtcNow;

				if (mostRecentScreening.CurrentValidation != null)
				{
					mostRecentScreening.CurrentValidation.Status = Status.Cancelado;
					mostRecentScreening.CurrentValidation = null;
					mostRecentScreening.CurrentValidationId = null;
				}
			}

			var newScreening = new Screening
			{
				PatientId = screening.PatientId,
				Index = screening.Index,
				CreatedAt = screening.CreatedAt,
			};

			newScreening.Affiliateds ??= new List<Affiliated>();
			newScreening.Affiliateds.Add(student);

			_context.Screenings.Add(newScreening);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetScreening", new { id = newScreening.Id }, newScreening);
		}

		public class ScreeningAnswerBody
		{
			public string? Question
			{
				get;
				set;
			}
			public string? Content
			{
				get;
				set;
			}
			public bool? Highlight
			{
				get;
				set;
			}
		}

		[HttpPost("{id}/Answer")]
		public async Task<ActionResult<ScreeningAnswer>> AddAnswer(int id, [FromBody] ScreeningAnswerBody answer)
		{

			var treatment = await _context.Screenings.FirstOrDefaultAsync(t => t.Id == id);

			if (treatment == null)
			{
				return NotFound("Screening not found.");
			}

			var newAnswer = new ScreeningAnswer
			{
				Question = answer.Question,
				Content = answer.Content,
				Highlight = answer.Highlight,
				ScreeningId = id,
				CreatedAt = DateTime.UtcNow,
			};

			_context.ScreeningAnswers.Add(newAnswer);
			await _context.SaveChangesAsync();

			return Ok(newAnswer);
		}

		public class ScreeningValidationBody
		{
			public required List<int> AnswersList
			{
				get;
				set;
			}
			public required int TeacherId { get; set; }
			public required int StudentId { get; set; }
		}

		[HttpPost("{id}/Validation")]
		public async Task<ActionResult<ScreeningAnswer>> CreateValidation(int id, [FromBody] ScreeningValidationBody validation)
		{

			var screening = await _context.Screenings
			.Include(a => a.CurrentValidation)
			.FirstOrDefaultAsync(a => a.Id == id);

			if (screening == null)
			{
				return NotFound("Screening not found.");
			}


			var teacher = await _context.Affiliateds.FirstOrDefaultAsync(t => t.Id == validation.TeacherId);

			if (teacher == null)
			{
				return NotFound("Teacher not found.");
			}


			var student = await _context.Affiliateds.FirstOrDefaultAsync(t => t.Id == validation.StudentId);

			if (student == null)
			{
				return NotFound("Student not found.");
			}

			var answers = await _context.ScreeningAnswers
				  .Where(a => a.Id.HasValue && validation.AnswersList.Contains(a.Id.Value))
				  .ToListAsync();


			if (answers.Count != validation.AnswersList.Count)
			{
				return BadRequest("One or more answer IDs are invalid.");
			}

			if (screening.CurrentValidation != null)
			{
				screening.CurrentValidation.Status = Enums.Status.Cancelado;
			}


			var newValidation = new ScreeningValidation
			{
				ScreeningId = id,
				TeacherId = validation.TeacherId,
				StudentId = validation.StudentId,
				Status = Enums.Status.Validando,
				CreatedAt = DateTime.UtcNow,
				Answers = answers,
			};


			_context.ScreeningValidations.Add(newValidation);

			var saveResult = _context.SaveChanges();

			if (saveResult <= 0 || newValidation == null || newValidation.Id == null)
			{
				return BadRequest("Something went wrong");
			}

			screening.CurrentValidationId = newValidation.Id;

			foreach (var answer in answers)
			{
				answer.ValidationId = (int)newValidation.Id;
				_context.ScreeningAnswers.Update(answer);
			}

			var noValidatedAnswers = await _context.ScreeningAnswers
									.Where(a => a.ValidationId == null)
									.ToListAsync();

			_context.ScreeningAnswers.RemoveRange(noValidatedAnswers);

			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(newValidation, options);

			return Ok(json);
		}

		public class ValidateScreeningBody
		{
			public required string Feedback { get; set; }
			public required int ValidationId { get; set; }
			public required Enums.Status Status { get; set; }
		}

		[HttpPost("{id}/Validate")]
		public async Task<ActionResult<ScreeningAnswer>> ValidateScreening(int id, [FromBody] ValidateScreeningBody validation)
		{

			var screening = await _context.Screenings
			.Include(a => a.CurrentValidation)
			.FirstOrDefaultAsync(a => a.Id == id);

			if (screening == null)
			{
				return NotFound("Screening not found.");
			}

			if (screening.CurrentValidation == null || screening.CurrentValidation.Id != validation.ValidationId)
			{
				return NotFound("Wrong validation id.");
			}


			screening.CurrentValidation.Feedback = validation.Feedback;
			screening.CurrentValidation.Status = validation.Status;


			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(screening, options);

			return Ok(json);
		}

		private bool ScreeningExists(int? id)
		{
			return _context.Screenings.Any(e => e.Id == id);
		}
	}
}
