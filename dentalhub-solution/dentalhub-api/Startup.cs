using dentalhub_api.Enums;
using dentalhub_api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace dentalhub_api
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddDbContext<DentalhubContext>(options =>
				options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

			services.AddControllers();

			services.AddEndpointsApiExplorer();

			services.AddSwaggerGen(c =>
			{
				c.SwaggerDoc("v1", new OpenApiInfo { Title = "DentalHub API", Version = "v1" });

				c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
				{
					Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
					Name = "Authorization",
					In = ParameterLocation.Header,
					Type = SecuritySchemeType.ApiKey
				});

				c.AddSecurityRequirement(new OpenApiSecurityRequirement
				{
					{
						new OpenApiSecurityScheme
						{
							Reference = new OpenApiReference
							{
								Type = ReferenceType.SecurityScheme,
								Id = "Bearer"
							}
						},
						new string[] {}
					}
				});
			});

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("EqoIPN+Gs+uPlVsyHTzQ9PTMz6sHNV9SsmTXuD7/4oI=\r\n"));

			services.AddAuthentication(options =>
			{
				options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(options =>
			{
				options.RequireHttpsMetadata = false;
				options.SaveToken = true;
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = false,
					ValidateAudience = false,
					ValidateLifetime = true,
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = key,
				};
			});

			services.AddAuthorization(options =>
			{
				options.AddPolicy("UserPolicy", policy =>
					policy.RequireAssertion(context =>
					{
						var userTypeClaim = context.User.FindFirst(claim => claim.Type == "UserType");
						if (userTypeClaim == null)
						{
							return false;
						}

						var userTypeValue = userTypeClaim.Value;
						return userTypeValue == UserType.Patient.ToString() ||
							   userTypeValue == UserType.Teacher.ToString() ||
							   userTypeValue == UserType.FrontDesk.ToString() ||
							   userTypeValue == UserType.Student.ToString() ||
							   userTypeValue == UserType.Admin.ToString();
					})
				);
			});


			services.AddCors(options =>
			{
				options.AddPolicy("AllowSpecificOrigins",
					builder =>
					{
						builder.WithOrigins("http://localhost:3000", "https://dentalhub.vercel.app")
							   .AllowAnyHeader()
							   .AllowAnyMethod()
							   .AllowCredentials();
					});
			});
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseSwagger();
				app.UseSwaggerUI(c =>
				{
					c.SwaggerEndpoint("/swagger/v1/swagger.json", "DentalHub API V1");
					c.RoutePrefix = string.Empty;
				});
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseRouting();

			app.UseAuthentication();
			app.UseAuthorization();
			app.UseStaticFiles();


			app.UseCors("AllowSpecificOrigins");

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});

			using (var scope = app.ApplicationServices.CreateScope())
			{
				var dbContext = scope.ServiceProvider.GetRequiredService<DentalhubContext>();

				try
				{
					dbContext.Database.Migrate();
					Console.WriteLine("Migrations applied successfully.");
				}
				catch (Exception ex)
				{
					Console.WriteLine("Error applying migrations: " + ex.Message);
					throw;
				}
			}
		}
	}
}
