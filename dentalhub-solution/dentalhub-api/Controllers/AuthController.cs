using dentalhub_api.Enums;
using dentalhub_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace dentalhub_api.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly DentalhubContext _context;

		public AuthController(DentalhubContext context)
		{
			_context = context;
		}

		public class UserBody
		{
			public required string username
			{
				get;
				set;
			}
			public required string password
			{
				get;
				set;
			}
			public required UserType type
			{
				get;
				set;
			}
		}

		[HttpPost]
		public IActionResult Authentication(UserBody request)
		{
			User? user = null;

			switch (request.type)
			{
				case UserType.Patient:
					user = _context.RegularPatients.FirstOrDefault(u => u.Login == request.username);

					if (user == null)
					{
						user = _context.PediatricPatients.FirstOrDefault(u => u.Login == request.username);
					}

					break;

				case UserType.Teacher:
					user = _context.Affiliateds.FirstOrDefault(u => u.Login == request.username);
					break;
				case UserType.FrontDesk:
					user = _context.FrontDesks.FirstOrDefault(u => u.Login == request.username);
					break;
				case UserType.Student:
					user = _context.Affiliateds.FirstOrDefault(u => u.Login == request.username);
					break;
				case UserType.Admin:
					user = _context.Admins.FirstOrDefault(u => u.Login == request.username);
					break;

				default:
					return BadRequest(new
					{
						error = "Tipo de usuário desconhecido"
					});
			}

			if (user != null && user.ValidatePassword(request.password))
			{
				var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("EqoIPN+Gs+uPlVsyHTzQ9PTMz6sHNV9SsmTXuD7/4oI=\r\n"));

				var tokenDescriptor = new SecurityTokenDescriptor
				{
					Subject = new ClaimsIdentity(new[] {
						new Claim(ClaimTypes.Name, request.username),
						new Claim("UserType", (request.type).ToString())
					}),
					Expires = DateTime.UtcNow.AddHours(144),
					SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
				};

				var tokenHandler = new JwtSecurityTokenHandler();
				var token = tokenHandler.CreateToken(tokenDescriptor);

				return Ok(new
				{
					token = tokenHandler.WriteToken(token),
					user,
				});
			}
			else
			{
				return BadRequest(new
				{
					error = "Credenciais inválidas"
				});
			}
		}


		[HttpGet("Validate")]
		public IActionResult GetUserInfoFromToken()
		{
			if (!Request.Headers.TryGetValue("Authorization", out var tokenHeader))
			{
				return BadRequest(new { error = "Token inválido" });
			}

			var token = tokenHeader.ToString().Replace("Bearer ", string.Empty).Trim();
			var tokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.UTF8.GetBytes("EqoIPN+Gs+uPlVsyHTzQ9PTMz6sHNV9SsmTXuD7/4oI=\r\n");

			try
			{
				var claimsPrincipal = tokenHandler.ValidateToken(token, new TokenValidationParameters
				{
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = new SymmetricSecurityKey(key),
					ValidateIssuer = false,
					ValidateAudience = false,
					ClockSkew = TimeSpan.Zero
				}, out SecurityToken validatedToken);

				var username = claimsPrincipal.FindFirst(ClaimTypes.Name)?.Value;
				var userTypeString = claimsPrincipal.FindFirst("UserType")?.Value;

				if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(userTypeString))
				{
					return BadRequest(new { error = "Token inválido" });
				}

				User? user = null;

				if (Enum.TryParse(userTypeString, out UserType userType))
				{
					switch (userType)
					{
						case UserType.Patient:
							user = _context.RegularPatients.FirstOrDefault(u => u.Login == username);
							if (user == null)
							{
								user = _context.PediatricPatients.FirstOrDefault(u => u.Login == username);
							}
							break;
						case UserType.Teacher:
							user = _context.Affiliateds.FirstOrDefault(u => u.Login == username);
							break;
						case UserType.FrontDesk:
							user = _context.FrontDesks.FirstOrDefault(u => u.Login == username);
							break;
						case UserType.Student:
							user = _context.Affiliateds.FirstOrDefault(u => u.Login == username);
							break;
						case UserType.Admin:
							user = _context.Admins.FirstOrDefault(u => u.Login == username);
							break;
						default:
							return BadRequest(new { error = "Tipo de usuário desconhecido" });
					}
				}

				if (user == null)
				{
					return NotFound(new { error = "Usuário não encontrado" });
				}

				return Ok(new { user });
			}
			catch (SecurityTokenException)
			{
				return Unauthorized(new { error = "Token inválido" });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { error = "Internal server error", details = ex.Message });
			}
		}
	}

}
