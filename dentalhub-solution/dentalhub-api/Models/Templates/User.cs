using dentalhub_api.Enums;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

namespace dentalhub_api.Models
{
	[PrimaryKey(nameof(Id))]
	public abstract class User
	{
		[Key]
		public int? Id { get; set; }

		[Required]
		public required string Name { get; set; }

		[Required]
		public required string Login { get; set; }

		private string? _passwordHash;

		[NotMapped]
		public abstract UserType UserType { get; }

		[JsonIgnore]
		public string PasswordHash
		{
			get { return _passwordHash; }
			private set { _passwordHash = value; }
		}

		[JsonIgnore]
		public string Password
		{
			set
			{
				if (!string.IsNullOrWhiteSpace(value))
				{
					_passwordHash = HashPassword(value);
				}
			}
		}

		[Required]
		public required DateTime UpdatedAt { get; set; }

		[Required]
		public required DateTime CreatedAt { get; set; }

		public bool ValidatePassword(string inputPassword)
		{
			return _passwordHash == HashPassword(inputPassword);
		}

		private string HashPassword(string password)
		{
			using (SHA256 sha256 = SHA256.Create())
			{
				byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));

				StringBuilder builder = new StringBuilder();
				for (int i = 0; i < hashedBytes.Length; i++)
				{
					builder.Append(hashedBytes[i].ToString("x2"));
				}
				return builder.ToString();
			}
		}
	}
}
