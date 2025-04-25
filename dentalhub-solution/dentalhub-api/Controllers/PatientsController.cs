using dentalhub_api.Enums;
using dentalhub_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace dentalhub_api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize(Policy = "UserPolicy")]
	public class PatientsController : ControllerBase
	{
		private readonly DentalhubContext _context;
		private readonly IWebHostEnvironment _webHostEnvironment;
		public PatientsController(IWebHostEnvironment webHostEnvironment, DentalhubContext context)
		{
			_webHostEnvironment = webHostEnvironment;
			_context = context;
		}

		// GET: api/Patients/{id}
		[HttpGet("{id}")]

		public async Task<ActionResult> GetPatient(int id)
		{


			var options = new JsonSerializerOptions
			{
				ReferenceHandler = ReferenceHandler.Preserve,
				PropertyNamingPolicy = JsonNamingPolicy.CamelCase
			};

			var json = JsonSerializer.Serialize(options, options);

			var PediatricPatient = await _context.PediatricPatients
												.Include(p => p.Address)
												.Include(p => p.Treatments)
												.Include(p => p.Responsible)
													.ThenInclude(r => r.RegularPatient)
												.Include(p => p.Terms)
												.Include(p => p.PeriodontalCharts)
												.Include(p => p.Anamneses)
												.Include(p => p.Screenings)
												.Include(p => p.Atms)
												.FirstOrDefaultAsync(p => p.Id == id);

			if (PediatricPatient == null)
			{
				var RegularPatient = await _context.RegularPatients
												.Include(p => p.Address)
												.Include(p => p.ComercialAddress)
												.Include(p => p.Treatments)
												.Include(p => p.Responsible)
													.ThenInclude(r => r.RegularPatient)
												.Include(p => p.Terms)
												.Include(p => p.PeriodontalCharts)
												.Include(p => p.Anamneses)
												.Include(p => p.Screenings)
												.Include(p => p.Atms)
												.FirstOrDefaultAsync(p => p.Id == id);

				if (RegularPatient == null)
				{
					return NotFound();
				}

				json = JsonSerializer.Serialize(RegularPatient, options);
				return Ok(json);
			}

			json = JsonSerializer.Serialize(PediatricPatient, options);
			return Ok(json);
		}

		// GET: api/Patients/Regulars
		[HttpGet("Regulars")]
		public async Task<ActionResult<IEnumerable<RegularPatient>>> GetPatientRegular()
		{
			return await _context.RegularPatients.ToListAsync();
		}

		// GET: api/Patients/Pediatrics
		[HttpGet("Pediatrics")]
		public async Task<ActionResult<IEnumerable<PediatricPatient>>> GetPatientPediatric()
		{
			return await _context.PediatricPatients.ToListAsync();
		}

		public class PostPatientBody
		{
			public required string Name { get; set; }

			public required DateTime BirthDate { get; set; }
			public string? SusRegionalCard { get; set; }
			public string? SusNationalCard { get; set; }
			public string? Nationality { get; set; }
			public Gender Gender { get; set; }
			public EthnicGroup EthnicGroup { get; set; }
			public bool? IsDependent { get; set; }

		}

		// POST: api/Patient/Create
		[HttpPost("Create")]
		public async Task<ActionResult<Patient>> PostPatient(PostPatientBody patient)
		{
			int pediatricPatientCount = await _context.PediatricPatients.CountAsync();
			int regularPatientCount = await _context.RegularPatients.CountAsync();

			string patientID = (regularPatientCount + pediatricPatientCount + 1).ToString();
			string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
			string combinedString = timestamp + patientID;

			if (combinedString.Length < 18)
			{
				combinedString = combinedString.PadRight(18, '0');
			}

			combinedString = combinedString.Substring(0, 18);

			if (patient.BirthDate > DateTime.Now.AddYears(-13))
			{
				var pediatricPatient = new PediatricPatient
				{
					Token = combinedString,
					Login = combinedString,
					Name = patient.Name,
					Password = patient.BirthDate.ToString("ddMMyyyy"),
					BirthDate = patient.BirthDate,
					SusRegionalCard = patient.SusRegionalCard,
					SusNationalCard = patient.SusNationalCard,
					Nationality = patient.Nationality,
					Gender = patient.Gender,
					EthnicGroup = patient.EthnicGroup,
					IsDependent = patient.IsDependent,
					UpdatedAt = DateTime.Now.ToUniversalTime(),
					CreatedAt = DateTime.Now.ToUniversalTime(),
				};

				pediatricPatient.Id = pediatricPatientCount + regularPatientCount + 1;

				_context.PediatricPatients.Add(pediatricPatient);
				await _context.SaveChangesAsync();


				if (pediatricPatient.Id != null)
				{
					return await GetPatient((int)pediatricPatient.Id);
				}

				return Ok(pediatricPatient);
			}
			else
			{
				var regularPatient = new RegularPatient
				{
					Token = combinedString,
					Login = combinedString,
					Name = patient.Name,
					Password = patient.BirthDate.ToString("ddMMyyyy"),
					BirthDate = patient.BirthDate,
					Nationality = patient.Nationality,
					SusRegionalCard = patient.SusRegionalCard,
					SusNationalCard = patient.SusNationalCard,
					Gender = patient.Gender,
					EthnicGroup = patient.EthnicGroup,
					IsDependent = patient.IsDependent,
					UpdatedAt = DateTime.Now.ToUniversalTime(),
					CreatedAt = DateTime.Now.ToUniversalTime(),
				};

				regularPatient.Id = pediatricPatientCount + regularPatientCount + 1;

				_context.RegularPatients.Add(regularPatient);
				await _context.SaveChangesAsync();

				if (regularPatient.Id != null)
				{
					return await GetPatient((int)regularPatient.Id);
				}

				return Ok(regularPatient);
			}
		}

		public class PartialPatientBody
		{
			public string? Name { get; set; }

			public string? Login { get; set; }
			public string? Email { get; set; }
			public DateTime? BirthDate { get; set; }
			public string? Phone { get; set; }
			public string? SusRegionalCard { get; set; }
			public string? SusNationalCard { get; set; }
			public string? Nationality { get; set; }
			public Gender? Gender { get; set; }
			public EthnicGroup? EthnicGroup { get; set; }
			public bool? IsDependent { get; set; }

		}

		// PATCH: api/Patients/update/{id}
		[HttpPatch("Update/{id}")]
		public async Task<ActionResult> UpdatePatient(int id, PartialPatientBody patient)
		{
			var PediatricPatient = await _context.PediatricPatients.Include(p => p.Address).FirstOrDefaultAsync(p => p.Id == id);

			if (PediatricPatient == null)
			{
				var RegularPatient = await _context.RegularPatients.Include(p => p.Address).Include(p => p.ComercialAddress).FirstOrDefaultAsync(p => p.Id == id);

				if (RegularPatient == null)
				{
					return NotFound();
				}

				if (!string.IsNullOrEmpty(patient.Email))
				{
					RegularPatient.Email = patient.Email;
					RegularPatient.Login = patient.Email;
				}
				if (patient.BirthDate != default(DateTime) && patient.BirthDate != null)
				{
					RegularPatient.Password = ((DateTime)patient.BirthDate).ToString("ddMMyyyy");
					RegularPatient.BirthDate = (DateTime)patient.BirthDate;
				}

				if (!string.IsNullOrEmpty(patient.Nationality))
				{
					RegularPatient.Nationality = patient.Nationality;
				}
				if (!string.IsNullOrEmpty(patient.Phone))
				{
					RegularPatient.Phone = patient.Phone;
				}
				if (!string.IsNullOrEmpty(patient.SusRegionalCard))
				{
					RegularPatient.SusRegionalCard = patient.SusRegionalCard;
				}
				if (!string.IsNullOrEmpty(patient.SusNationalCard))
				{
					RegularPatient.SusNationalCard = patient.SusNationalCard;
				}
				if (patient.Gender != null)
				{
					RegularPatient.Gender = (Gender)patient.Gender;
				}
				if (patient.EthnicGroup != null)
				{
					RegularPatient.EthnicGroup = (EthnicGroup)patient.EthnicGroup;
				}

				RegularPatient.IsDependent = patient.IsDependent;
				RegularPatient.UpdatedAt = DateTime.Now.ToUniversalTime();

				if (!string.IsNullOrEmpty(patient.Name))
				{
					RegularPatient.Name = patient.Name;
				}

				await _context.SaveChangesAsync();

				if (RegularPatient.Id != null)
				{
					return await GetPatient((int)RegularPatient.Id);
				}

				return Ok(RegularPatient);
			}


			if (!string.IsNullOrEmpty(patient.Email))
			{
				PediatricPatient.Login = patient.Email;
			}
			if (patient.BirthDate != default(DateTime) && patient.BirthDate != null)
			{
				PediatricPatient.Password = ((DateTime)patient.BirthDate).ToString("ddMMyyyy");
				PediatricPatient.BirthDate = (DateTime)patient.BirthDate;
			}

			if (!string.IsNullOrEmpty(patient.Nationality))
			{
				PediatricPatient.Nationality = patient.Nationality;
			}
			if (!string.IsNullOrEmpty(patient.SusRegionalCard))
			{
				PediatricPatient.SusRegionalCard = patient.SusRegionalCard;
			}
			if (!string.IsNullOrEmpty(patient.SusNationalCard))
			{
				PediatricPatient.SusNationalCard = patient.SusNationalCard;
			}
			if (patient.Gender != null)
			{
				PediatricPatient.Gender = (Gender)patient.Gender;
			}
			if (patient.EthnicGroup != null)
			{
				PediatricPatient.EthnicGroup = (EthnicGroup)patient.EthnicGroup;
			}
			PediatricPatient.IsDependent = patient.IsDependent;
			PediatricPatient.UpdatedAt = DateTime.Now.ToUniversalTime();

			if (!string.IsNullOrEmpty(patient.Name))
			{
				PediatricPatient.Name = patient.Name;
			}

			await _context.SaveChangesAsync();

			if (PediatricPatient.Id != null)
			{
				return await GetPatient((int)PediatricPatient.Id);
			}


			return Ok(PediatricPatient);
		}

		public class PartialRegularPatient
		{
			public string? Occupation { get; set; }

			public string? ExpeditionRG { get; set; }

			public string? Rg { get; set; }
			public string? Email { get; set; }
			public string? Phone { get; set; }


			public CivilStatus? CivilStatus { get; set; }

			public string? Cpf { get; set; }

			public string? Recommendation { get; set; }

			public string? FatherName { get; set; }

			public string? MotherName { get; set; }

		}

		// Post: api/Patient/Regular/Infos
		[HttpPatch("Regular/Infos/{id}")]
		public async Task<ActionResult<RegularPatient>> PutRegularPatient(int id, PartialRegularPatient bodyPatient)
		{
			var patient = await _context.RegularPatients.Include(p => p.Address).Include(p => p.ComercialAddress).FirstOrDefaultAsync(p => p.Id == id);

			if (patient == null)
			{
				return NotFound();
			}


			if (!string.IsNullOrEmpty(bodyPatient.Occupation))
			{
				patient.Occupation = bodyPatient.Occupation;
			}

			if (bodyPatient.CivilStatus != null)
			{
				patient.CivilStatus = (CivilStatus)bodyPatient.CivilStatus;
			}

			if (!string.IsNullOrEmpty(bodyPatient.Cpf))
			{
				patient.Cpf = bodyPatient.Cpf;
				patient.Login = bodyPatient.Cpf;
			}

			if (!string.IsNullOrEmpty(bodyPatient.Rg))
			{
				patient.Rg = bodyPatient.Rg;
			}


			if (!string.IsNullOrEmpty(bodyPatient.Phone))
			{
				patient.Phone = bodyPatient.Phone;
			}


			if (!string.IsNullOrEmpty(bodyPatient.Email))
			{
				patient.Email = bodyPatient.Email;
			}


			if (!string.IsNullOrEmpty(bodyPatient.ExpeditionRG))
			{
				patient.ExpeditionRG = bodyPatient.ExpeditionRG;
			}

			if (!string.IsNullOrEmpty(bodyPatient.Recommendation))
			{
				patient.Recommendation = bodyPatient.Recommendation;
			}

			if (!string.IsNullOrEmpty(bodyPatient.MotherName))
			{
				patient.MotherName = bodyPatient.MotherName;
			}

			if (!string.IsNullOrEmpty(bodyPatient.FatherName))
			{
				patient.FatherName = bodyPatient.FatherName;
			}

			patient.UpdatedAt = DateTime.Now.ToUniversalTime();
			await _context.SaveChangesAsync();

			if (patient.Id != null)
			{
				return await GetPatient((int)patient.Id);
			}

			return Ok(patient);
		}

		public class PartialPediatricPatient
		{
			public string? SchoolName { get; set; }
			public string? SchoolSeries { get; set; }
			public SchoolShift? SchoolShift { get; set; }
		}

		// Post: api/Patients/Pediatric/Infos
		[HttpPatch("Pediatric/Infos/{id}")]
		public async Task<ActionResult<RegularPatient>> PutPediatricPatient(int id, PartialPediatricPatient bodyPatient)
		{
			var patient = await _context.PediatricPatients.FindAsync(id);

			if (patient == null)
			{
				return NotFound();
			}

			if (!string.IsNullOrEmpty(bodyPatient.SchoolName))
			{
				patient.SchoolName = bodyPatient.SchoolName;
			}

			if (bodyPatient.SchoolShift != null)
			{
				patient.SchoolShift = bodyPatient.SchoolShift;
			}

			if (!string.IsNullOrEmpty(bodyPatient.SchoolSeries))
			{
				patient.SchoolSeries = bodyPatient.SchoolSeries;
			}

			patient.UpdatedAt = DateTime.Now.ToUniversalTime();

			await _context.SaveChangesAsync();

			if (patient.Id != null)
			{
				return await GetPatient((int)patient.Id);
			}

			return Ok(patient);

		}


		[HttpPost("UploadFile")]
		public async Task<ActionResult> UploadFile(IFormFile file)
		{
			if (file == null || file.Length == 0)
			{
				return BadRequest("Arquivo não fornecido ou vazio.");
			}

			var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
			var extension = Path.GetExtension(file.FileName).ToLower();
			if (!Array.Exists(allowedExtensions, e => e == extension))
			{
				return BadRequest("Tipo de arquivo não suportado.");
			}

			string fileUrl;
			try
			{
				string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
				if (!Directory.Exists(uploadsFolder))
				{
					Directory.CreateDirectory(uploadsFolder);
				}
				string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
				string filePath = Path.Combine(uploadsFolder, uniqueFileName);

				using (var stream = new FileStream(filePath, FileMode.Create))
				{
					await file.CopyToAsync(stream);
				}


				var request = HttpContext.Request;
				var baseUrl = $"{request.Scheme}://{request.Host.Value}";

				fileUrl = $"{baseUrl}/uploads/{uniqueFileName}";
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Erro ao fazer upload do arquivo: {ex.Message}");
			}


			return Ok(new { fileUrl });
		}


		public class TermBody
		{
			public required IFormFile file { get; set; }
			public required TermTypes Type { get; set; }
			public required int PatientId { get; set; }

		}


		[HttpPost("Term")]
		public async Task<ActionResult> Term([FromForm] TermBody newTerm)
		{
			if (newTerm == null || newTerm.file == null || newTerm.file.Length == 0)
			{
				return BadRequest("Arquivo não fornecido ou vazio.");
			}


			var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
			var extension = Path.GetExtension(newTerm.file.FileName).ToLower();

			if (!Array.Exists(allowedExtensions, e => e == extension))
			{
				return BadRequest("Tipo de arquivo não suportado.");
			}

			const int maxFileSize = 2 * 1024 * 1024;

			if (newTerm.file.Length > maxFileSize)
			{
				return BadRequest("O tamanho do arquivo excede o limite máximo permitido (2MB).");
			}

			string fileUrl;

			try
			{
				string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");

				// Determine the subdirectory based on the file type
				string subDirectory;
				if (extension == ".jpg" || extension == ".jpeg" || extension == ".png")
				{
					subDirectory = "images";
				}
				else if (extension == ".pdf")
				{
					subDirectory = "documents";
				}
				else
				{
					return BadRequest("Tipo de arquivo não suportado.");
				}

				string uploadPath = Path.Combine(uploadsFolder, subDirectory);
				if (!Directory.Exists(uploadPath))
				{
					Directory.CreateDirectory(uploadPath);
				}

				string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(newTerm.file.FileName);
				string filePath = Path.Combine(uploadPath, uniqueFileName);

				// Save the file
				using (var stream = new FileStream(filePath, FileMode.Create))
				{
					await newTerm.file.CopyToAsync(stream);
				}

				var request = HttpContext.Request;
				var baseUrl = $"{request.Scheme}://{request.Host.Value}";

				fileUrl = $"{baseUrl}/uploads/{subDirectory}/{uniqueFileName}";
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Erro ao fazer upload do arquivo: {ex.Message}");
			}

			var term = new Term
			{
				Name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(Path.GetFileNameWithoutExtension(newTerm.file.FileName).ToLower()) + Path.GetExtension(newTerm.file.FileName).ToLower(),
				UpdatedAt = DateTime.Now.ToUniversalTime(),
				CreatedAt = DateTime.Now.ToUniversalTime(),
				Url = fileUrl,
				Type = newTerm.Type,
				PatientId = newTerm.PatientId,
			};

			_context.Terms.Add(term);
			await _context.SaveChangesAsync();

			return Ok(term);
		}



		public class ReportBody
		{
			public required int Id { get; set; }
			public required Enums.UserType Type { get; set; }

		}



		[HttpPost("{patientId}/report")]
		public async Task<ActionResult> GetPatientReport(int patientId, [FromBody] ReportBody request)
		{
			if (request == null || request.Id <= 0)
			{
				return BadRequest("Invalid request body or missing data.");
			}

			var user = await GetUserByTypeAsync(request);

			if (user == null)
			{
				return NotFound("User not found.");
			}


			Patient userPatient = (Patient)await GetPatientAsync(patientId);

			if (userPatient == null)
			{
				return NotFound("Patient not found.");
			}

			var options = new JsonSerializerOptions
			{
				WriteIndented = true,
				ReferenceHandler = ReferenceHandler.Preserve,
				PropertyNamingPolicy = JsonNamingPolicy.CamelCase
			};

			if (request.Type == UserType.Patient)
			{
				if (userPatient.Id == request.Id)
				{
					return Ok(JsonSerializer.Serialize(userPatient, options));
				}

				var regularResponsibleIds = userPatient.Responsible != null ? userPatient.Responsible.Select(r => r.ResponsibleId).ToList() : new List<int?>();

				if (regularResponsibleIds.Contains(request.Id))
				{
					return Ok(JsonSerializer.Serialize(userPatient, options));
				}

				return NotFound();
			}


			var patient = await GetPatientAsync(patientId);

			if (patient == null)
			{
				return NotFound("Patient not found.");
			}

			return Ok(JsonSerializer.Serialize(patient, options));
		}

		private async Task<object> GetUserByTypeAsync(ReportBody request)
		{
			switch (request.Type)
			{
				case Enums.UserType.Patient:
					return await GetPatientAsync(request.Id);
				case Enums.UserType.Teacher:
				case Enums.UserType.Student:
					return await _context.Affiliateds.FirstOrDefaultAsync(u => u.Id == request.Id);
				case Enums.UserType.Admin:
					return await _context.Admins.FirstOrDefaultAsync(u => u.Id == request.Id);
				case Enums.UserType.FrontDesk:
					return null; // Invalid case, return null or handle differently
				default:
					return null; // Unknown type, handle as needed
			}
		}

		private async Task<object> GetPatientAsync(int id)
		{
			var pediatricPatient = await _context.PediatricPatients
				.Include(p => p.Address)
				.Include(p => p.Treatments)
				.Include(p => p.Responsible)
					.ThenInclude(r => r.RegularPatient)
				.Include(p => p.Terms)
				.Include(p => p.PeriodontalCharts)
				.Include(p => p.Anamneses)
				.Include(p => p.Atms)
				.FirstOrDefaultAsync(p => p.Id == id);

			if (pediatricPatient != null)
			{
				return pediatricPatient;
			}

			var regularPatient = await _context.RegularPatients
				.Include(p => p.Address)
				.Include(p => p.ComercialAddress)
				.Include(p => p.Treatments)
				.Include(p => p.Responsible)
					.ThenInclude(r => r.RegularPatient)
				.Include(p => p.Terms)
				.Include(p => p.PeriodontalCharts)
				.Include(p => p.Anamneses)
				.Include(p => p.Atms)
				.FirstOrDefaultAsync(p => p.Id == id);

			return regularPatient;
		}
	}
}
