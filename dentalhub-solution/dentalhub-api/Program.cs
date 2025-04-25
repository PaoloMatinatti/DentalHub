using dentalhub_api.Enums;
using dentalhub_api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DentalhubContext>(options =>
	options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo { Title = "DentalHub API", Version = "3.0.0" });
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

// Add JWT authentication
builder.Services.AddAuthentication(options =>
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

// Add authorization policies
builder.Services.AddAuthorization(options =>
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


builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowSpecificOrigins", builder =>
	{
		builder.WithOrigins("http://localhost:3000", "https://dentalhub.vercel.app")
			   .AllowAnyMethod()
			   .AllowAnyHeader()
			   .AllowCredentials();
	});
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseDeveloperExceptionPage();

	app.UseSwagger();

	app.UseSwaggerUI(c =>
	{
		c.SwaggerEndpoint("/swagger/v1/swagger.json", "DentalHub API V1");
	});
}

app.UseHttpsRedirection();
app.UseRouting();


app.UseCors("AllowSpecificOrigins");

app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();

app.UseEndpoints(endpoints =>
{
	endpoints.MapControllers();
});

SeedData.EnsurePopulated(app.Services);

app.Run();
