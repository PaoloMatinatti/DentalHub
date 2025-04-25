using dentalhub_api.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace dentalhub_api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize(Policy = "UserPolicy")]
	public class EnumsController : ControllerBase
	{
		[HttpGet("Genders")]
		public ActionResult<Dictionary<string, int>> GetGenders()
		{
			var genders = new Dictionary<string, int>();

			foreach (Gender gender in Enum.GetValues(typeof(Gender)))
			{
				genders.Add(gender.ToString(), (int)gender);
			}

			return Ok(genders);
		}

		[HttpGet("EthnicGroups")]
		public ActionResult<Dictionary<string, int>> GetGroups()
		{
			var groups = new Dictionary<string, int>();

			foreach (EthnicGroup group in Enum.GetValues(typeof(EthnicGroup)))
			{
				groups.Add(group.ToString(), (int)group);
			}

			return Ok(groups);
		}
	}
}
