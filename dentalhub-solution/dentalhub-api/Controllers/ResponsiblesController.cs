using dentalhub_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace dentalhub_api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize(Policy = "UserPolicy")]
	public class ResponsiblesController : ControllerBase
	{
		private readonly DentalhubContext _context;

		public ResponsiblesController(DentalhubContext context)
		{
			_context = context;
		}

		public class CreateResponsibleBody
		{
			public required string cpf { get; set; }
			public required int patientId { get; set; }
		}


		// POST: api/Responsibles/Create
		[HttpPost("create")]
		public async Task<ActionResult> CreateResponsible(CreateResponsibleBody body)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var responsiblePatient = await _context.RegularPatients
				.FirstOrDefaultAsync(rp => rp.Cpf == body.cpf);

			if (responsiblePatient == null || responsiblePatient.Id == null)
			{
				return NotFound("Responsible patient not found");
			}

			if (responsiblePatient.Id == body.patientId)
			{
				return BadRequest("The patientId and responsibleId should not be the same");
			}

			var pediatricPatient = await _context.PediatricPatients.FirstOrDefaultAsync(p => p.Id == body.patientId);
			var regularPatient = await _context.RegularPatients.FirstOrDefaultAsync(p => p.Id == body.patientId);

			if (regularPatient == null && pediatricPatient == null)
			{
				return NotFound("Patient not found");
			}

			if ((regularPatient != null && (regularPatient.IsDependent == false || regularPatient.IsDependent == null)) || (pediatricPatient != null && (pediatricPatient.IsDependent == false || pediatricPatient.IsDependent == null)))
			{
				return BadRequest("This patient is not a dependent.");
			}

			var existentResponsible = await _context.Responsibles.FirstOrDefaultAsync(p => p.RegularPatientId == responsiblePatient.Id && p.PatientId == body.patientId);

			if (existentResponsible != null)
			{
				return BadRequest("A Responsible Connection already exists between these Patients.");
			}


			var responsible = new Responsible
			{
				RegularPatientId = (int)responsiblePatient.Id,
				PatientId = body.patientId
			};

			_context.Responsibles.Add(responsible);
			await _context.SaveChangesAsync();

			var loadedResponsible = await _context.Responsibles
				.Include(r => r.Patient)
				.Include(r => r.RegularPatient)
				.FirstOrDefaultAsync(r => r.ResponsibleId == responsible.ResponsibleId);

			var options = new JsonSerializerOptions
			{
				ReferenceHandler = ReferenceHandler.Preserve,
				WriteIndented = true,
				MaxDepth = 10
			};

			if (loadedResponsible != null)
			{

				var simplifiedResponsible = new
				{
					loadedResponsible.ResponsibleId,
					loadedResponsible.PatientId,
					loadedResponsible.RegularPatientId,
					Patient = new
					{
						loadedResponsible.Patient?.Id,
						loadedResponsible.Patient?.Name
					},
					RegularPatient = new
					{
						loadedResponsible.RegularPatient?.Id,
						loadedResponsible.RegularPatient?.Name,
						loadedResponsible.RegularPatient?.Cpf,
					}
				};

				var json = JsonSerializer.Serialize(simplifiedResponsible, options);

				return Ok(simplifiedResponsible);
			}


			return BadRequest("Error");

		}

		// GET: api/Responsibles
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Responsible>>> GetResponsibles()
		{
			return await _context.Responsibles.ToListAsync();
		}

		// GET: api/Responsibles/5
		[HttpGet("{id}")]
		public async Task<ActionResult<Responsible>> GetResponsible(int? id)
		{
			var responsible = await _context.Responsibles.FindAsync(id);

			if (responsible == null)
			{
				return NotFound();
			}

			return responsible;
		}

		// GET: api/Responsibles/Patient/5
		[HttpGet("Patient/{id}")]
		public async Task<IActionResult> GetPatientsByResponsible(int? id)
		{
			if (id == null)
			{
				return BadRequest(new { message = "Id cannot be null" });
			}

			var responsible = await _context.RegularPatients
									  .FirstOrDefaultAsync(rp => rp.Id == id);

			if (responsible == null)
			{
				return NotFound(new { message = $"Regular Patient not found with id {id}" });
			}


			var patients = await _context.Responsibles
									 .Where(r => r.RegularPatientId == id)
									 .Select(r => r.Patient != null ? new
									 {
										 Token = r.Patient.Token,
										 Id = r.Patient.Id,
										 Name = r.Patient.Name,
										 Birthdate = r.Patient.BirthDate
									 } : null)
									 .ToListAsync();

			if (patients == null || !patients.Any())
			{
				return NotFound(new { message = "This Patient has no responsibles." });
			}

			patients.Add(new
			{
				Token = responsible.Token,
				Id = responsible.Id,
				Name = responsible.Name,
				Birthdate = responsible.BirthDate
			});

			return Ok(patients);
		}



		// DELETE: api/Responsibles/delete
		[HttpDelete("delete")]
		public async Task<ActionResult> DeleteResponsibleByCpf(CreateResponsibleBody body)
		{
			var responsiblePatient = await _context.RegularPatients.FirstOrDefaultAsync(rp => rp.Cpf == body.cpf);

			if (responsiblePatient == null || responsiblePatient.Id == null)
			{
				return NotFound("Responsible patient not found");
			}

			// Additional logic
			if (responsiblePatient.Id == body.patientId)
			{
				return BadRequest("The patientId and responsibleId should not be the same");
			}

			var pediatricPatient = await _context.PediatricPatients.FirstOrDefaultAsync(p => p.Id == body.patientId);
			var regularPatient = await _context.RegularPatients.FirstOrDefaultAsync(p => p.Id == body.patientId);

			if (regularPatient == null && pediatricPatient == null)
			{
				return NotFound("Patient not found");
			}

			if ((regularPatient != null && (regularPatient.IsDependent == false || regularPatient.IsDependent == null)) || (pediatricPatient != null && (pediatricPatient.IsDependent == false || pediatricPatient.IsDependent == null)))
			{
				return BadRequest("This patient is not a dependent.");
			}

			var existentResponsible = await _context.Responsibles.FirstOrDefaultAsync(p => p.RegularPatientId == responsiblePatient.Id && p.PatientId == body.patientId);

			if (existentResponsible == null)
			{
				return NotFound("Responsible connection not found");
			}

			// Delete logic
			_context.Responsibles.Remove(existentResponsible);
			await _context.SaveChangesAsync();

			return Ok(new JsonResult("Deletado com sucesso."));
		}



		// PUT: api/Responsibles/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut("{id}")]
		public async Task<IActionResult> PutResponsible(int? id, Responsible responsible)
		{
			if (id != responsible.ResponsibleId)
			{
				return BadRequest();
			}

			_context.Entry(responsible).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!ResponsibleExists(id))
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

		// POST: api/Responsibles
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<Responsible>> PostResponsible(Responsible responsible)
		{
			_context.Responsibles.Add(responsible);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetResponsible", new { id = responsible.ResponsibleId }, responsible);
		}

		private bool ResponsibleExists(int? id)
		{
			return _context.Responsibles.Any(e => e.ResponsibleId == id);
		}
	}
}
