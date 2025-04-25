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
	public class AttachmentsController : ControllerBase
	{
		private readonly DentalhubContext _context;
		private readonly IWebHostEnvironment _webHostEnvironment;
		public AttachmentsController(IWebHostEnvironment webHostEnvironment, DentalhubContext context)
		{
			_webHostEnvironment = webHostEnvironment;
			_context = context;
		}

		public class AddChronologicalPlanBody
		{
			public required string Content
			{
				get;
				set;
			}
			public required int TreatmentId
			{
				get;
				set;
			}
			public required int StudentId
			{
				get;
				set;
			}
		}

		[HttpPost("ChronologicalPlan")]
		public async Task<ActionResult> AddChronologicalPlan([FromBody] AddChronologicalPlanBody attachment)
		{
			var student = await _context.Affiliateds.FindAsync(attachment.StudentId);

			if (student == null)
			{
				return BadRequest("Student not found");
			}

			var treatment = await _context.Treatments.Include(t => t.ChronologicalPlans).FirstOrDefaultAsync(t => t.Id == attachment.TreatmentId);

			if (treatment == null)
			{
				return BadRequest("Treatment not found");
			}

			var mostRecentChronologicalPlan = await _context.ChronologicalPlans
			.Where(t => t.TreatmentId == attachment.TreatmentId && t.EndedAt == null).FirstOrDefaultAsync();

			if (mostRecentChronologicalPlan != null)
			{
				mostRecentChronologicalPlan.EndedAt = DateTime.UtcNow;

				var mostRecentValidation = await _context.ChronologicalPlanValidations.Where(a => a.AttachmentId == mostRecentChronologicalPlan.Id &&
					a.Status == Status.Validando).FirstOrDefaultAsync();

				if (mostRecentValidation != null)
				{
					mostRecentValidation.Status = Status.Cancelado;
					mostRecentValidation.EndedAt = DateTime.UtcNow;
				}
			}


			var newAttachment = new ChronologicalPlan()
			{
				Content = attachment.Content,
				CreatedAt = DateTime.UtcNow,
				UpdatedAt = DateTime.UtcNow,
				LastStudentEditId = attachment.StudentId,
				LastStudentEdit = student,
				TreatmentId = attachment.TreatmentId,
			};


			_context.ChronologicalPlans.Add(newAttachment);
			await _context.SaveChangesAsync();

			var options = new System.Text.Json.JsonSerializerOptions
			{
				PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase,
				ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve
			};

			return new JsonResult(treatment.ChronologicalPlans, options);
		}

		public class ChronologicalPlanValidationBody
		{
			public required int TeacherId { get; set; }
			public required int StudentId { get; set; }
		}

		[HttpPost("ChronologicalPlan/{id}/Validation")]
		public async Task<ActionResult> CreateChronologicalPlanValidation(int id, [FromBody] ChronologicalPlanValidationBody validation)
		{

			var chronologicalPlan = await _context.ChronologicalPlans.FirstOrDefaultAsync(a => a.Id == id);

			if (chronologicalPlan == null)
			{
				return NotFound("ChronologicalPlan not found.");
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


			var mostRecentValidation = await _context.ChronologicalPlanValidations.Where(a => a.AttachmentId == chronologicalPlan.Id &&
				a.Status == Status.Validando).FirstOrDefaultAsync();


			if (mostRecentValidation != null)
			{
				mostRecentValidation.Status = Enums.Status.Cancelado;
			}


			var newValidation = new ChronologicalPlanValidation
			{
				AttachmentId = id,
				TeacherId = validation.TeacherId,
				StudentId = validation.StudentId,
				Status = Enums.Status.Validando,
				CreatedAt = DateTime.UtcNow,
				Type = Enums.AttachmentTypes.PlanoCronologico
			};

			_context.ChronologicalPlanValidations.Add(newValidation);

			var saveResult = _context.SaveChanges();

			if (saveResult <= 0 || newValidation == null || newValidation.Id == null)
			{
				return BadRequest("Something went wrong");
			}


			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(newValidation, options);

			return Ok(json);
		}

		public class ValidateChronologicalPlanBody
		{
			public required string Feedback { get; set; }
			public required int ValidationId { get; set; }
			public required Enums.Status Status { get; set; }
		}

		[HttpPost("ChronologicalPlan/{id}/Validate")]
		public async Task<ActionResult> ValidateChronologicalPlan(int id, [FromBody] ValidateChronologicalPlanBody validation)
		{

			var chronologicalPlan = await _context.ChronologicalPlans
			.FirstOrDefaultAsync(a => a.Id == id);

			if (chronologicalPlan == null)
			{
				return NotFound("ChronologicalPlan not found.");
			}

			var attachmentValidation = await _context.ChronologicalPlanValidations.FirstOrDefaultAsync(a => a.Id == validation.ValidationId);

			if (attachmentValidation == null || attachmentValidation.AttachmentId != id)
			{
				return NotFound("Wrong validation id.");
			}


			attachmentValidation.Feedback = validation.Feedback;
			attachmentValidation.Status = validation.Status;


			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(chronologicalPlan, options);

			return Ok(json);
		}

		public class AddPeriodontalChartBody
		{
			public required IFormFile file { get; set; }

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
		}

		[HttpPost("PeriodontalChart")]
		public async Task<ActionResult> AddPeriodontalChart([FromForm] AddPeriodontalChartBody attachment)
		{
			var student = await _context.Affiliateds.FindAsync(attachment.StudentId);

			if (student == null)
			{
				return BadRequest("Student not found");
			}

			Patient patient = await _context.RegularPatients.Include(t => t.PeriodontalCharts).FirstOrDefaultAsync(t => t.Id == attachment.StudentId);

			if (patient == null)
			{
				patient = await _context.PediatricPatients.Include(t => t.PeriodontalCharts).FirstOrDefaultAsync(t => t.Id == attachment.StudentId);
			}

			if (patient == null)
			{
				return BadRequest("Patient not found");
			}

			var mostRecentPeriodontalChart = await _context.PeriodontalCharts
			.Where(t => t.PatientId == attachment.PatientId && t.EndedAt == null).FirstOrDefaultAsync();

			if (mostRecentPeriodontalChart != null)
			{
				mostRecentPeriodontalChart.EndedAt = DateTime.UtcNow;

				var mostRecentValidation = await _context.PeriodontalChartValidations.Where(a => a.AttachmentId == mostRecentPeriodontalChart.Id &&
					a.Status == Status.Validando).FirstOrDefaultAsync();

				if (mostRecentValidation != null)
				{
					mostRecentValidation.Status = Status.Cancelado;
					mostRecentValidation.EndedAt = DateTime.UtcNow;
				}
			}

			var uploadResult = await HandleFileUpload(attachment.file);

			if (!uploadResult.Success)
			{
				return BadRequest(uploadResult.Message);
			}


			var newAttachment = new PeriodontalChart()
			{
				Url = uploadResult.FileUrl,
				PatientId = attachment.PatientId,
				CreatedAt = DateTime.UtcNow,
				UpdatedAt = DateTime.UtcNow,
				LastStudentEditId = attachment.StudentId,
				LastStudentEdit = student,
			};


			_context.PeriodontalCharts.Add(newAttachment);
			await _context.SaveChangesAsync();

			var options = new System.Text.Json.JsonSerializerOptions
			{
				PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase,
				ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve
			};

			return new JsonResult(patient.PeriodontalCharts, options);
		}

		public class PeriodontalChartValidationBody
		{
			public required int TeacherId { get; set; }
			public required int StudentId { get; set; }
		}

		[HttpPost("PeriodontalChart/{id}/Validation")]
		public async Task<ActionResult> CreatePeriodontalChartValidation(int id, [FromBody] PeriodontalChartValidationBody validation)
		{

			var periodontalChart = await _context.PeriodontalCharts.FirstOrDefaultAsync(a => a.Id == id);

			if (periodontalChart == null)
			{
				return NotFound("PeriodontalChart not found.");
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


			var mostRecentValidation = await _context.PeriodontalChartValidations.Where(a => a.AttachmentId == periodontalChart.Id &&
				a.Status == Status.Validando).FirstOrDefaultAsync();


			if (mostRecentValidation != null)
			{
				mostRecentValidation.Status = Enums.Status.Cancelado;
			}


			var newValidation = new PeriodontalChartValidation
			{
				AttachmentId = id,
				TeacherId = validation.TeacherId,
				StudentId = validation.StudentId,
				Status = Enums.Status.Validando,
				CreatedAt = DateTime.UtcNow,
				Type = Enums.AttachmentTypes.MapaPeriodontal
			};

			_context.PeriodontalChartValidations.Add(newValidation);

			var saveResult = _context.SaveChanges();

			if (saveResult <= 0 || newValidation == null || newValidation.Id == null)
			{
				return BadRequest("Something went wrong");
			}


			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(newValidation, options);

			return Ok(json);
		}

		public class ValidatePeriodontalChartBody
		{
			public required string Feedback { get; set; }
			public required int ValidationId { get; set; }
			public required Enums.Status Status { get; set; }
		}

		[HttpPost("PeriodontalChart/{id}/Validate")]
		public async Task<ActionResult> ValidatePeriodontalChart(int id, [FromBody] ValidatePeriodontalChartBody validation)
		{

			var periodontalChart = await _context.PeriodontalCharts
			.FirstOrDefaultAsync(a => a.Id == id);

			if (periodontalChart == null)
			{
				return NotFound("PeriodontalChart not found.");
			}

			var attachmentValidation = await _context.PeriodontalChartValidations.FirstOrDefaultAsync(a => a.Id == validation.ValidationId);

			if (attachmentValidation == null || attachmentValidation.AttachmentId != id)
			{
				return NotFound("Wrong validation id.");
			}



			attachmentValidation.Feedback = validation.Feedback;
			attachmentValidation.Status = validation.Status;


			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(periodontalChart, options);

			return Ok(json);
		}


		[HttpGet("PeriodontalChart/Patient/{id}")]
		public async Task<ActionResult> GetPeriodontalChartsByPatient(int? id)
		{
			RegularPatient regularPatient = await _context.RegularPatients
				.Include(t => t.Anamneses)
				.Include(t => t.PeriodontalCharts)
				.ThenInclude(p => p.LastStudentEdit)
				.FirstOrDefaultAsync(a => a.Id == id);

			PediatricPatient pediatricPatient = await _context.PediatricPatients
				.Include(t => t.Anamneses)
				.Include(t => t.PeriodontalCharts)
				.ThenInclude(p => p.LastStudentEdit)
				.FirstOrDefaultAsync(a => a.Id == id);

			var patient = regularPatient as Patient ?? pediatricPatient;

			if (patient == null)
			{
				return NotFound();
			}


			var periodontalCharts = new List<object>();

			if (patient.PeriodontalCharts != null)
			{
				periodontalCharts = (await Task.WhenAll(patient.PeriodontalCharts.Select(async plan =>
				{
					var mostRecentValidation = await _context.PeriodontalChartValidations
						.Where(a => a.AttachmentId == plan.Id)
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

			var result = new
			{
				patient.Id,
				patient.Name,
				patient.CreatedAt,
				HasAnamnese = patient.Anamneses != null ? patient.Anamneses.Count(a => a.EndedAt == null) > 0 : false,
				PeriodontalCharts = periodontalCharts
			};


			return Ok(result);
		}




		public class AddPainDrawBody
		{

			public required IFormFile file { get; set; }
			public required int TreatmentId
			{
				get;
				set;
			}
			public required int StudentId
			{
				get;
				set;
			}
		}

		[HttpPost("PainDraw")]
		public async Task<ActionResult> AddPainDraw([FromForm] AddPainDrawBody attachment)
		{
			var student = await _context.Affiliateds.FindAsync(attachment.StudentId);

			if (student == null)
			{
				return BadRequest("Student not found");
			}

			var treatment = await _context.Atms.Include(t => t.PainDraws).FirstOrDefaultAsync(t => t.Id == attachment.TreatmentId);

			if (treatment == null)
			{
				return BadRequest("Treatment not found");
			}

			var mostRecentPainDraw = await _context.PainDraws
			.Where(t => t.AtmId == attachment.TreatmentId && t.EndedAt == null).FirstOrDefaultAsync();

			if (mostRecentPainDraw != null)
			{
				mostRecentPainDraw.EndedAt = DateTime.UtcNow;

				var mostRecentValidation = await _context.PainDrawValidations.Where(a => a.AttachmentId == mostRecentPainDraw.Id &&
					a.Status == Status.Validando).FirstOrDefaultAsync();

				if (mostRecentValidation != null)
				{
					mostRecentValidation.Status = Status.Cancelado;
					mostRecentValidation.EndedAt = DateTime.UtcNow;
				}
			}


			var uploadResult = await HandleFileUpload(attachment.file);

			if (!uploadResult.Success)
			{
				return BadRequest(uploadResult.Message);
			}


			var newAttachment = new PainDraw()
			{
				Url = uploadResult.FileUrl,
				CreatedAt = DateTime.UtcNow,
				UpdatedAt = DateTime.UtcNow,
				LastStudentEditId = attachment.StudentId,
				LastStudentEdit = student,
				AtmId = attachment.TreatmentId,
			};


			_context.PainDraws.Add(newAttachment);
			await _context.SaveChangesAsync();

			var options = new System.Text.Json.JsonSerializerOptions
			{
				PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase,
				ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve
			};

			return new JsonResult(treatment.PainDraws, options);
		}

		public class PainDrawValidationBody
		{
			public required int TeacherId { get; set; }
			public required int StudentId { get; set; }
		}

		[HttpPost("PainDraw/{id}/Validation")]
		public async Task<ActionResult> CreatePainDrawValidation(int id, [FromBody] PainDrawValidationBody validation)
		{

			var painDraw = await _context.PainDraws.FirstOrDefaultAsync(a => a.Id == id);

			if (painDraw == null)
			{
				return NotFound("PainDraw not found.");
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


			var mostRecentValidation = await _context.PainDrawValidations.Where(a => a.AttachmentId == painDraw.Id &&
				a.Status == Status.Validando).FirstOrDefaultAsync();


			if (mostRecentValidation != null)
			{
				mostRecentValidation.Status = Enums.Status.Cancelado;
			}


			var newValidation = new PainDrawValidation
			{
				AttachmentId = id,
				TeacherId = validation.TeacherId,
				StudentId = validation.StudentId,
				Status = Enums.Status.Validando,
				CreatedAt = DateTime.UtcNow,
				Type = Enums.AttachmentTypes.DesenhoDeDor
			};

			_context.PainDrawValidations.Add(newValidation);

			var saveResult = _context.SaveChanges();

			if (saveResult <= 0 || newValidation == null || newValidation.Id == null)
			{
				return BadRequest("Something went wrong");
			}


			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(newValidation, options);

			return Ok(json);
		}

		public class ValidatePainDrawBody
		{
			public required string Feedback { get; set; }
			public required int ValidationId { get; set; }
			public required Enums.Status Status { get; set; }
		}

		[HttpPost("PainDraw/{id}/Validate")]
		public async Task<ActionResult> ValidatePainDraw(int id, [FromBody] ValidatePainDrawBody validation)
		{

			var painDraw = await _context.PainDraws
			.FirstOrDefaultAsync(a => a.Id == id);

			if (painDraw == null)
			{
				return NotFound("PainDraw not found.");
			}

			var attachmentValidation = await _context.PainDrawValidations.FirstOrDefaultAsync(a => a.Id == validation.ValidationId);

			if (attachmentValidation == null || attachmentValidation.AttachmentId != id)
			{
				return NotFound("Wrong validation id.");
			}


			attachmentValidation.Feedback = validation.Feedback;
			attachmentValidation.Status = validation.Status;


			await _context.SaveChangesAsync();

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve
			};
			var json = JsonSerializer.Serialize(painDraw, options);

			return Ok(json);
		}


		[HttpGet("PainDraw/Atm/{id}")]
		public async Task<ActionResult> GetPainDrawsByPatient(int? id)
		{
			var atm = await _context.Atms
				.Include(t => t.PainDraws)
				.ThenInclude(p => p.LastStudentEdit)
				.FirstOrDefaultAsync(a => a.Id == id);

			if (atm == null)
			{
				return NotFound();
			}


			var painDraws = new List<object>();

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

			var result = new
			{
				atm.Id,
				atm.Index,
				atm.CreatedAt,
				PainDraws = painDraws
			};


			return Ok(result);
		}




		private async Task<(bool Success, string Message, string FileUrl)> HandleFileUpload(IFormFile file)
		{
			if (file == null || file.Length == 0)
			{
				return (false, "Arquivo não fornecido ou vazio.", null);
			}

			var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
			var extension = Path.GetExtension(file.FileName).ToLower();

			if (!Array.Exists(allowedExtensions, e => e == extension))
			{
				return (false, "Tipo de arquivo não suportado.", null);
			}

			const int maxFileSize = 2 * 1024 * 1024;

			if (file.Length > maxFileSize)
			{
				return (false, "O tamanho do arquivo excede o limite máximo permitido (2MB).", null);
			}
			string fileUrl;

			try
			{
				string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");

				// Determine the subdirectory based on the file type
				string subDirectory = extension switch
				{
					".jpg" or ".jpeg" or ".png" => "images",
					".pdf" => "documents",
					_ => null
				};

				if (subDirectory == null)
				{
					return (false, "Tipo de arquivo não suportado.", null);
				}

				string uploadPath = Path.Combine(uploadsFolder, subDirectory);
				if (!Directory.Exists(uploadPath))
				{
					Directory.CreateDirectory(uploadPath);
				}

				string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
				string filePath = Path.Combine(uploadPath, uniqueFileName);

				// Save the file
				using (var stream = new FileStream(filePath, FileMode.Create))
				{
					await file.CopyToAsync(stream);
				}

				var request = HttpContext.Request;
				var baseUrl = $"{request.Scheme}://{request.Host.Value}";

				fileUrl = $"{baseUrl}/uploads/{subDirectory}/{uniqueFileName}";
			}
			catch (Exception ex)
			{
				return (false, $"Erro ao fazer upload do arquivo: {ex.Message}", null);
			}

			return (true, "File uploaded successfully", fileUrl);
		}


	}
}
