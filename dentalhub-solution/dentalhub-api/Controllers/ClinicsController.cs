using dentalhub_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dentalhub_api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize(Policy = "UserPolicy")]
	public class ClinicsController : ControllerBase
	{
		private readonly DentalhubContext _context;

		public ClinicsController(DentalhubContext context)
		{
			_context = context;
		}

		// GET: api/Clinics
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Clinic>>> GetClinics()
		{
			return await _context.Clinics.ToListAsync();
		}

		// GET: api/Clinics/5
		[HttpGet("{id}")]
		public async Task<ActionResult<Clinic>> GetClinic(int id)
		{
			var clinic = await _context.Clinics.FindAsync(id);

			if (clinic == null)
			{
				return NotFound();
			}

			return clinic;
		}

		private bool ClinicExists(int id)
		{
			return _context.Clinics.Any(e => e.Id == id);
		}
	}
}
