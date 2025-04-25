using Microsoft.AspNetCore.Mvc;

namespace dentalhub_api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PingController : ControllerBase
	{
		private readonly ILogger<PingController> _logger;

		public PingController(ILogger<PingController> logger)
		{
			_logger = logger;
		}

		// route: /ping
		[HttpGet]
		public ActionResult<Dictionary<string, string>> Get()
		{

			var groups = new Dictionary<string, string>();
			groups.Add("ping", "pong");

			return Ok(groups);
		}
	}
}
