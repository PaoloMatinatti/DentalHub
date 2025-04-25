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
	public class AddressController : Controller
	{
		private readonly DentalhubContext _context;
		public AddressController(DentalhubContext context)
		{
			_context = context;
		}

		[HttpPost("Create/{patientId}")]
		public async Task<IActionResult> PostAddress(int patientId, Address address)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			int AddressCount = await _context.Addresses.CountAsync();
			var pediatricPatient = await _context.PediatricPatients.FindAsync(patientId);
			var newaddress = new Address
			{
				Id = AddressCount + 1,
				Uf = address.Uf,
				Number = address.Number,
				Cep = address.Cep,
				Telephone = address.Telephone,
				District = address.District,
				Street = address.Street,
				City = address.City,
				UpdatedAt = DateTime.Now.ToUniversalTime(),
				CreatedAt = DateTime.Now.ToUniversalTime()
			};


			if (pediatricPatient != null)
			{
				_context.Addresses.Add(newaddress);


				pediatricPatient.AddressId = newaddress.Id;
				_context.PediatricPatients.Update(pediatricPatient);
				await _context.SaveChangesAsync();

				var options = new JsonSerializerOptions
				{
					ReferenceHandler = ReferenceHandler.Preserve
				};


				return Ok(newaddress);
			}

			var regularPatient = await _context.RegularPatients.FindAsync(patientId);

			if (regularPatient != null)
			{
				_context.Addresses.Add(newaddress);
				await _context.SaveChangesAsync();

				regularPatient.AddressId = newaddress.Id;
				_context.RegularPatients.Update(regularPatient);
				await _context.SaveChangesAsync();

				var options = new JsonSerializerOptions
				{
					ReferenceHandler = ReferenceHandler.Preserve
				};

				var jsonResult = JsonSerializer.Serialize(newaddress, options);

				return Ok(newaddress);
			}

			return NotFound();
		}

		[HttpPost("Comercial/Create/{patientId}")]
		public async Task<IActionResult> PostAddressComercial(int patientId, Address address)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			int AddressCount = await _context.Addresses.CountAsync();
			var regularPatient = await _context.RegularPatients.FindAsync(patientId);


			if (regularPatient != null)
			{

				var newaddress = new Address
				{
					Id = AddressCount + 1,
					Uf = address.Uf,
					Number = address.Number,
					Cep = address.Cep,
					Telephone = address.Telephone,
					District = address.District,
					Street = address.Street,
					City = address.City,
					UpdatedAt = DateTime.Now.ToUniversalTime(),
					CreatedAt = DateTime.Now.ToUniversalTime()
				};

				_context.Addresses.Add(newaddress);
				await _context.SaveChangesAsync();

				regularPatient.ComercialAddressId = newaddress.Id;
				_context.RegularPatients.Update(regularPatient);
				await _context.SaveChangesAsync();

				var options = new JsonSerializerOptions
				{
					ReferenceHandler = ReferenceHandler.Preserve
				};

				var jsonResult = JsonSerializer.Serialize(newaddress, options);

				return Ok(newaddress);
			}
			return NotFound();
		}
	}
}
