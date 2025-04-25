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
	public class AnamneseController : ControllerBase
	{
		private readonly DentalhubContext _context;

		public AnamneseController(DentalhubContext context)
		{
			_context = context;
		}

		// GET: api/Anamnese
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Anamnese>>> GetAnamneses()
		{
			return await _context.Anamneses.ToListAsync();
		}

		// GET: api/Anamnese/5
		[HttpGet("{id}")]
		public async Task<ActionResult> GetAnamnese(int id)
		{
			var anamnese = await _context.Anamneses
				.Include(a => a.CurrentValidation)
				.FirstOrDefaultAsync(a => a.Id == id);


			if (anamnese == null)
			{
				return NotFound();
			}

			List<AnamneseAnswer>? answers = null;

			if (anamnese.CurrentValidation != null && anamnese.CurrentValidation.Answers is ICollection<AnamneseAnswer> treatmentAnswers)
			{
				answers = treatmentAnswers.Select(t => new AnamneseAnswer
				{
					Id = t.Id,
					AnamneseId = t.AnamneseId,
					Content = t.Content,
					Question = t.Question,
				}).ToList();
			}
			else
			{
				var allAnswers = await _context.AnamneseAnswers
							.Where(a => a.AnamneseId == id)
							.ToListAsync();

				var mostRecentAnswers = allAnswers
					.GroupBy(a => a.Question)
					.Select(g => g.OrderByDescending(a => a.CreatedAt).First())
					.ToList();

				answers = mostRecentAnswers
				   .Select(t => new AnamneseAnswer
				   {
					   Id = t.Id,
					   AnamneseId = t.AnamneseId,
					   ValidationId = t.ValidationId,
					   Content = t.Content,
					   Question = t.Question,
				   })
				   .ToList();
			}

			string? statusString = anamnese.CurrentValidation != null ?
				Enum.GetName(typeof(Status), anamnese.CurrentValidation.Status) :
				null;


			var result = new
			{
				anamnese.Id,
				anamnese.PatientId,
				anamnese.CurrentValidationId,
				anamnese.Index,
				anamnese.CreatedAt,
				Status = statusString,
				Feedback = anamnese.CurrentValidation != null ? anamnese.CurrentValidation.Feedback : null,
				Answers = answers
			};

			return Ok(result);
		}

		public class AnamneseBody
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

		// POST: api/Anamnese
		[HttpPost]
		public async Task<ActionResult<Anamnese>> PostAnamnese(AnamneseBody anamnese)
		{
			var student = await _context.Affiliateds.FindAsync(anamnese.StudentId);
			if (student == null)
			{
				return BadRequest("Student not found");
			}

			var mostRecentAnamnese = await _context.Anamneses
				.Where(t => t.PatientId == anamnese.PatientId && t.EndedAt == null)
				.FirstOrDefaultAsync();

			if (mostRecentAnamnese != null)
			{
				mostRecentAnamnese.EndedAt = DateTime.UtcNow;

				if (mostRecentAnamnese.CurrentValidation != null)
				{
					mostRecentAnamnese.CurrentValidation.Status = Status.Cancelado;
					mostRecentAnamnese.CurrentValidation = null;
					mostRecentAnamnese.CurrentValidationId = null;
				}
			}

			var newAnamnese = new Anamnese
			{
				PatientId = anamnese.PatientId,
				Index = anamnese.Index,
				CreatedAt = anamnese.CreatedAt,
			};

			newAnamnese.Affiliateds ??= new List<Affiliated>();
			newAnamnese.Affiliateds.Add(student);

			_context.Anamneses.Add(newAnamnese);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetAnamnese", new { id = newAnamnese.Id }, newAnamnese);
		}

		public class AnamneseAnswerBody
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
		public async Task<ActionResult<AnamneseAnswer>> AddAnswer(int id, [FromBody] AnamneseAnswerBody answer)
		{

			var treatment = await _context.Anamneses.FirstOrDefaultAsync(t => t.Id == id);

			if (treatment == null)
			{
				return NotFound("Anamnese not found.");
			}

			var newAnswer = new AnamneseAnswer
			{
				Question = answer.Question,
				Content = answer.Content,
				Highlight = answer.Highlight,
				AnamneseId = id,
				CreatedAt = DateTime.UtcNow,
			};

			_context.AnamneseAnswers.Add(newAnswer);
			await _context.SaveChangesAsync();

			return Ok(newAnswer);
		}

		public class AnamneseValidationBody
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
		public async Task<ActionResult<AnamneseAnswer>> CreateValidation(int id, [FromBody] AnamneseValidationBody validation)
		{

			var anamnese = await _context.Anamneses
			.Include(a => a.CurrentValidation)
			.FirstOrDefaultAsync(a => a.Id == id);

			if (anamnese == null)
			{
				return NotFound("Anamnese not found.");
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

			var answers = await _context.AnamneseAnswers
				  .Where(a => a.Id.HasValue && validation.AnswersList.Contains(a.Id.Value))
				  .ToListAsync();


			if (answers.Count != validation.AnswersList.Count)
			{
				return BadRequest("One or more answer IDs are invalid.");
			}

			if (anamnese.CurrentValidation != null)
			{
				anamnese.CurrentValidation.Status = Enums.Status.Cancelado;
			}


			var newValidation = new AnamneseValidation
			{
				AnamneseId = id,
				TeacherId = validation.TeacherId,
				StudentId = validation.StudentId,
				Status = Enums.Status.Validando,
				CreatedAt = DateTime.UtcNow,
				Answers = answers,
			};


			_context.AnamneseValidations.Add(newValidation);

			var saveResult = _context.SaveChanges();

			if (saveResult <= 0 || newValidation == null || newValidation.Id == null)
			{
				return BadRequest("Something went wrong");
			}

			anamnese.CurrentValidationId = newValidation.Id;

			foreach (var answer in answers)
			{
				answer.ValidationId = (int)newValidation.Id;
				_context.AnamneseAnswers.Update(answer);
			}

			var noValidatedAnswers = await _context.AnamneseAnswers
									.Where(a => a.ValidationId == null)
									.ToListAsync();

			_context.AnamneseAnswers.RemoveRange(noValidatedAnswers);

			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(newValidation, options);

			return Ok(json);
		}

		public class ValidateAnamneseBody
		{
			public required string Feedback { get; set; }
			public required int ValidationId { get; set; }
			public required Enums.Status Status { get; set; }
		}

		[HttpPost("{id}/Validate")]
		public async Task<ActionResult<AnamneseAnswer>> ValidateAnamnese(int id, [FromBody] ValidateAnamneseBody validation)
		{

			var anamnese = await _context.Anamneses
			.Include(a => a.CurrentValidation)
			.FirstOrDefaultAsync(a => a.Id == id);

			if (anamnese == null)
			{
				return NotFound("Anamnese not found.");
			}

			if (anamnese.CurrentValidation == null || anamnese.CurrentValidation.Id != validation.ValidationId)
			{
				return NotFound("Wrong validation id.");
			}


			anamnese.CurrentValidation.Feedback = validation.Feedback;
			anamnese.CurrentValidation.Status = validation.Status;


			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(anamnese, options);

			return Ok(json);
		}

		private bool AnamneseExists(int? id)
		{
			return _context.Anamneses.Any(e => e.Id == id);
		}
	}
}
