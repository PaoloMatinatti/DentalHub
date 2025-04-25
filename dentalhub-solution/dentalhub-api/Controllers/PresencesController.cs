using dentalhub_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dentalhub_api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize(Policy = "UserPolicy")]
	public class PresencesController : ControllerBase
	{
		private readonly DentalhubContext _context;

		public PresencesController(DentalhubContext context)
		{
			_context = context;
		}

		// GET: api/Presences
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Presence>>> GetPresences()
		{
			return await _context.Presences.Include(p => p.Patient).Include(p => p.FrontDesk).ToListAsync();
		}


		// GET: api/Presences/Clinic
		[HttpGet("Clinic/{id}")]
		public async Task<ActionResult<IEnumerable<Presence>>> GetPresencesFromClinic(int id)
		{
			var clinic = await _context.Clinics.FindAsync(id);


			if (clinic == null)
			{
				return NotFound();
			}

			var presences = await _context.Presences
						 .Where(p => p.ClinicId == id)
						 .Where(p => p.Exit == null)
						 .Include(p => p.Patient)
						 .Include(p => p.FrontDesk)
						 .ToListAsync();

			return presences;

		}

		// GET: api/Presences/5
		[HttpGet("{id}")]
		public async Task<ActionResult<Presence>> GetPresence(int id)
		{
			var presence = await _context.Presences.FindAsync(id);

			if (presence == null)
			{
				return NotFound();
			}

			return Ok(presence);
		}
		public class ExitInfo
		{
			public DateTime Exit { get; set; }
		}

		// PUT: api/Presences/unbook/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut("unbook/{id}")]
		public async Task<IActionResult> PutPatient(int id, ExitInfo exitInfo)
		{

			var presence = await _context.Presences.FindAsync(id);

			if (presence == null)
			{
				return NotFound();
			}

			presence.Exit = exitInfo.Exit;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!PresenceExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return Ok(presence);
		}



		// POST: api/Presences
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<Presence>> PostPresence(Presence presence)
		{
			_context.Presences.Add(presence);
			await _context.SaveChangesAsync();

			await _context.Entry(presence).Reference(e => e.Patient).LoadAsync();

			return CreatedAtAction("GetPresence", new { id = presence.Id }, presence);
		}

		private bool PresenceExists(int id)
		{
			return _context.Presences.Any(e => e.Id == id);
		}
	}
}
