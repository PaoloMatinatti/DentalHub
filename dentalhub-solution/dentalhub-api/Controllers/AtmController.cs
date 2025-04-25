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
	public class AtmController : ControllerBase
	{
		private readonly DentalhubContext _context;

		public AtmController(DentalhubContext context)
		{
			_context = context;
		}

		// GET: api/Atm
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Atm>>> GetAtms()
		{
			return await _context.Atms.ToListAsync();
		}

		// GET: api/Atm/5
		[HttpGet("{id}")]
		public async Task<ActionResult> GetAtm(int id)
		{
			var atm = await _context.Atms
				.Include(a => a.CurrentValidation).Include(a => a.PainDraws)
				.FirstOrDefaultAsync(a => a.Id == id);


			if (atm == null)
			{
				return NotFound();
			}

			List<AtmAnswer>? answers = null;

			if (atm.CurrentValidation != null && atm.CurrentValidation.Answers is ICollection<AtmAnswer> treatmentAnswers)
			{
				answers = treatmentAnswers.Select(t => new AtmAnswer
				{
					Id = t.Id,
					AtmId = t.AtmId,
					Content = t.Content,
					Question = t.Question,
				}).ToList();
			}
			else
			{
				var allAnswers = await _context.AtmAnswers
							.Where(a => a.AtmId == id)
							.ToListAsync();

				var mostRecentAnswers = allAnswers
					.GroupBy(a => a.Question)
					.Select(g => g.OrderByDescending(a => a.CreatedAt).First())
					.ToList();

				answers = mostRecentAnswers
				   .Select(t => new AtmAnswer
				   {
					   Id = t.Id,
					   AtmId = t.AtmId,
					   ValidationId = t.ValidationId,
					   Content = t.Content,
					   Question = t.Question,
				   })
				   .ToList();
			}

			List<object>? painDraws = null;


			if (atm.PainDraws != null)
			{
				painDraws = (await Task.WhenAll(atm.PainDraws.Select(async plan =>
				{
					var mostRecentValidation = await _context.PainDrawValidations
							.Where(a => a.AttachmentId == plan.Id)
							.OrderByDescending(a => a.CreatedAt)
							.FirstOrDefaultAsync();


					string? statusString = mostRecentValidation != null ?
					Enum.GetName(typeof(Status), mostRecentValidation.Status != null ? mostRecentValidation.Status : Status.Espera) :
					 Enum.GetName(typeof(Status), plan?.EndedAt == null ? Status.Espera : Status.Cancelado);

					return new
					{
						plan.Id,
						plan.Url,
						plan.CreatedAt,
						plan.EndedAt,
						Status = statusString,
						Feedback = mostRecentValidation != null ? mostRecentValidation.Feedback : null,
						CurrentValidationId = mostRecentValidation != null ? mostRecentValidation.Id : null,
						LastEditName = plan.LastStudentEdit != null ? plan.LastStudentEdit.Name : null,
					};
				}))).ToList<object>();
			}

			string? statusString = atm.CurrentValidation != null ?
				Enum.GetName(typeof(Status), atm.CurrentValidation.Status) :
				null;


			var result = new
			{
				atm.Id,
				atm.PatientId,
				atm.CurrentValidationId,
				atm.Index,
				atm.CreatedAt,
				Status = statusString,
				Feedback = atm.CurrentValidation != null ? atm.CurrentValidation.Feedback : null,
				Answers = answers,
				PainDraws = painDraws,
			};

			return Ok(result);
		}

		public class AtmBody
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

		// POST: api/Atm
		[HttpPost]
		public async Task<ActionResult<Atm>> PostAtm(AtmBody atm)
		{
			var student = await _context.Affiliateds.FindAsync(atm.StudentId);
			if (student == null)
			{
				return BadRequest("Student not found");
			}

			var mostRecentAtm = await _context.Atms
				.Where(t => t.PatientId == atm.PatientId && t.EndedAt == null)
				.FirstOrDefaultAsync();

			if (mostRecentAtm != null)
			{
				mostRecentAtm.EndedAt = DateTime.UtcNow;

				if (mostRecentAtm.CurrentValidation != null)
				{
					mostRecentAtm.CurrentValidation.Status = Status.Cancelado;
					mostRecentAtm.CurrentValidation = null;
					mostRecentAtm.CurrentValidationId = null;
				}
			}

			var newAtm = new Atm
			{
				PatientId = atm.PatientId,
				Index = atm.Index,
				CreatedAt = atm.CreatedAt,
			};

			newAtm.Affiliateds ??= new List<Affiliated>();
			newAtm.Affiliateds.Add(student);

			_context.Atms.Add(newAtm);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetAtm", new { id = newAtm.Id }, newAtm);
		}

		public class AtmAnswerBody
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
		public async Task<ActionResult<AtmAnswer>> AddAnswer(int id, [FromBody] AtmAnswerBody answer)
		{

			var treatment = await _context.Atms.FirstOrDefaultAsync(t => t.Id == id);

			if (treatment == null)
			{
				return NotFound("Atm not found.");
			}

			var newAnswer = new AtmAnswer
			{
				Question = answer.Question,
				Content = answer.Content,
				Highlight = answer.Highlight,
				AtmId = id,
				CreatedAt = DateTime.UtcNow,
			};

			_context.AtmAnswers.Add(newAnswer);
			await _context.SaveChangesAsync();

			return Ok(newAnswer);
		}

		public class AtmValidationBody
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
		public async Task<ActionResult<AtmAnswer>> CreateValidation(int id, [FromBody] AtmValidationBody validation)
		{

			var atm = await _context.Atms
			.Include(a => a.CurrentValidation)
			.FirstOrDefaultAsync(a => a.Id == id);

			if (atm == null)
			{
				return NotFound("Atm not found.");
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

			var answers = await _context.AtmAnswers
				  .Where(a => a.Id.HasValue && validation.AnswersList.Contains(a.Id.Value))
				  .ToListAsync();


			if (answers.Count != validation.AnswersList.Count)
			{
				return BadRequest("One or more answer IDs are invalid.");
			}

			if (atm.CurrentValidation != null)
			{
				atm.CurrentValidation.Status = Enums.Status.Cancelado;
			}


			var newValidation = new AtmValidation
			{
				AtmId = id,
				TeacherId = validation.TeacherId,
				StudentId = validation.StudentId,
				Status = Enums.Status.Validando,
				CreatedAt = DateTime.UtcNow,
				Answers = answers,
			};


			_context.AtmValidations.Add(newValidation);

			var saveResult = _context.SaveChanges();

			if (saveResult <= 0 || newValidation == null || newValidation.Id == null)
			{
				return BadRequest("Something went wrong");
			}

			atm.CurrentValidationId = newValidation.Id;

			foreach (var answer in answers)
			{
				answer.ValidationId = (int)newValidation.Id;
				_context.AtmAnswers.Update(answer);
			}

			var noValidatedAnswers = await _context.AtmAnswers
									.Where(a => a.ValidationId == null)
									.ToListAsync();

			_context.AtmAnswers.RemoveRange(noValidatedAnswers);

			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(newValidation, options);

			return Ok(json);
		}

		public class ValidateAtmBody
		{
			public required string Feedback { get; set; }
			public required int ValidationId { get; set; }
			public required Enums.Status Status { get; set; }
		}

		[HttpPost("{id}/Validate")]
		public async Task<ActionResult<AtmAnswer>> ValidateAtm(int id, [FromBody] ValidateAtmBody validation)
		{

			var atm = await _context.Atms
			.Include(a => a.CurrentValidation)
			.FirstOrDefaultAsync(a => a.Id == id);

			if (atm == null)
			{
				return NotFound("Atm not found.");
			}

			if (atm.CurrentValidation == null || atm.CurrentValidation.Id != validation.ValidationId)
			{
				return NotFound("Wrong validation id.");
			}


			atm.CurrentValidation.Feedback = validation.Feedback;
			atm.CurrentValidation.Status = validation.Status;


			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(atm, options);

			return Ok(json);
		}

		private bool AtmExists(int? id)
		{
			return _context.Atms.Any(e => e.Id == id);
		}
	}
}
