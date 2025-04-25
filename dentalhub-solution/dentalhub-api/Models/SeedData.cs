using dentalhub_api.Enums;
using Microsoft.EntityFrameworkCore;

namespace dentalhub_api.Models
{
	public class SeedData
	{
		public static void EnsurePopulated(IServiceProvider serviceProvider)
		{
			using (var scope = serviceProvider.CreateScope())
			{
				var services = scope.ServiceProvider;
				var context = services.GetRequiredService<DentalhubContext>();
				context.Database.Migrate();

				if (!context.Addresses.Any())
				{
					context.Addresses.AddRange(
						new Address
						{
							Id = 1,
							Uf = Uf.MG,
							Number = "180",
							Cep = "37136162",
							Telephone = "3598888888",
							District = "Jardim América",
							City = "Alfenas",
							Street = "Rua João Cesário",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),

						},
						new Address
						{
							Id = 2,
							Uf = Uf.SP,
							Number = "150",
							Cep = "04571010",
							Telephone = "1199999999",
							District = "Jardim Paulista",
							City = "São Paulo",
							Street = "Avenida Paulista",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						},
						new Address
						{
							Id = 3,
							Uf = Uf.RJ,
							Number = "300",
							Cep = "22041001",
							Telephone = "2122222222",
							District = "Copacabana",
							City = "Rio de Janeiro",
							Street = "Rua Barata Ribeiro",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						},
						new Address
						{
							Id = 4,
							Uf = Uf.PR,
							Number = "500",
							Cep = "80060120",
							Telephone = "4133333333",
							District = "Centro",
							City = "Curitiba",
							Street = "Rua XV de Novembro",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						}
					);

					context.SaveChanges();
				}

				if (!context.RegularPatients.Any())
				{
					context.RegularPatients.AddRange(
						new RegularPatient
						{
							Id = 1,
							Name = "John Doe",
							Login = "admin+regular_patient@dentalhub.com",
							Email = "admin+regular_patient@dentalhub.com",
							Password = "zZPvN9",
							Token = "00000000000",
							BirthDate = new DateTime(2003, 06, 12).ToUniversalTime(),
							Gender = Enums.Gender.Male,
							CivilStatus = Enums.CivilStatus.UniãoEstável,
							EthnicGroup = Enums.EthnicGroup.Branco,
							Phone = "00000000000",
							SusRegionalCard = "000000",
							SusNationalCard = "000000",
							ExpeditionRG = "2008-12-05",
							Nationality = "Brasileira",
							FatherName = "Joohny Doe",
							MotherName = "Janine Doe",
							Occupation = "Desenvolvedor",
							Cpf = "00000000000",
							Rg = "00000000000",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
							AddressId = 1,
						},
						new RegularPatient
						{
							Id = 2,
							Name = "Mary Smith",
							Login = "mary_smith",
							Email = "mary_smith@email.com",
							Password = "password456",
							Token = "15223327042025",
							BirthDate = new DateTime(1990, 4, 15).ToUniversalTime(),
							ExpeditionRG = "2008-12-05",
							Gender = Gender.Female,
							CivilStatus = CivilStatus.Casado,
							EthnicGroup = EthnicGroup.Branco,
							Phone = "35988919140",
							SusRegionalCard = "654321",
							SusNationalCard = "098765",
							Nationality = "American",
							FatherName = "John Smith",
							MotherName = "Maria Smith",
							Occupation = "Teacher",
							Cpf = "12345678903",
							Rg = "987654320",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
							AddressId = 2,
						},
						new RegularPatient
						{
							Id = 3,
							Name = "Carlos Garcia",
							Login = "carlos_garcia",
							Email = "carlos_garcia@email.com",
							Password = "password789",
							Token = "15223327042026",
							BirthDate = new DateTime(1985, 10, 20).ToUniversalTime(),
							ExpeditionRG = "2008-12-05",
							Gender = Gender.Male,
							CivilStatus = CivilStatus.Solteiro,
							EthnicGroup = EthnicGroup.Pardo,
							Phone = "35988919140",
							SusRegionalCard = "135791",
							SusNationalCard = "246813",
							Nationality = "Mexican",
							FatherName = "Javier Garcia",
							MotherName = "Maria Garcia",
							Occupation = "Engineer",
							Cpf = "98765432100",
							Rg = "456789123",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
							AddressId = 3,
						},
						new RegularPatient
						{
							Id = 4,
							Name = "Emma Johnson",
							Login = "emma_johnson",
							Email = "emma_johnson@email.com",
							Password = "passwordABC",
							Token = "15223327042027",
							BirthDate = new DateTime(1997, 8, 5).ToUniversalTime(),
							ExpeditionRG = "2008-12-05",
							Gender = Gender.Female,
							CivilStatus = CivilStatus.Divorciado,
							EthnicGroup = EthnicGroup.AfroBrasileiro,
							Phone = "35988919140",
							SusRegionalCard = "987654",
							SusNationalCard = "654321",
							Nationality = "British",
							FatherName = "William Johnson",
							MotherName = "Sarah Johnson",
							Occupation = "Doctor",
							Cpf = "32109876543",
							Rg = "789123456",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
							AddressId = 4,
						});

					context.SaveChanges();
				}

				if (!context.PediatricPatients.Any())
				{
					context.PediatricPatients.AddRange(
						new PediatricPatient
						{
							Id = 5,
							Name = "João Silva",
							Login = "admin+pediatric_patient@dentalhub.com",
							Password = "zZPvN9",
							BirthDate = new DateTime(2014, 7, 20).ToUniversalTime(),
							SusRegionalCard = "000000",
							IsDependent = true,
							SusNationalCard = "000000",
							Nationality = "Brasileira",
							Gender = Gender.Male,
							EthnicGroup = EthnicGroup.Pardo,
							AddressId = 1,
							SchoolName = "Escola Alegria",
							SchoolSeries = "Segunda",
							SchoolShift = SchoolShift.Vespertino,
							Token = "000000000000",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						},
						new PediatricPatient
						{
							Id = 6,
							Name = "Ana Santos",
							Login = "ana_santos",
							IsDependent = true,
							Password = "Senha789",
							BirthDate = new DateTime(2015, 9, 15).ToUniversalTime(),
							SusRegionalCard = "987654",
							SusNationalCard = "654321",
							Nationality = "Brasileira",
							Gender = Gender.Female,
							EthnicGroup = EthnicGroup.Branco,
							AddressId = 3,
							SchoolName = "Escola Felicidade",
							SchoolSeries = "Terceira",
							SchoolShift = SchoolShift.Matutino,
							Token = "15223327042026",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						},
						new PediatricPatient
						{
							Id = 7,
							Name = "Pedro Oliveira",
							Login = "pedro_oliveira",
							IsDependent = true,
							Password = "SenhaABC",
							BirthDate = new DateTime(2012, 6, 5).ToUniversalTime(),
							SusRegionalCard = "246810",
							SusNationalCard = "135792",
							Nationality = "Brasileira",
							Gender = Gender.Male,
							EthnicGroup = EthnicGroup.Branco,
							AddressId = 4,
							SchoolName = "Escola do Saber",
							SchoolSeries = "Quarta",
							SchoolShift = SchoolShift.Noturno,
							Token = "15223327042027",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						}
					 );

					context.SaveChanges();
				}

				if (!context.Clinics.Any())
				{
					context.Clinics.AddRange(
						new Clinic
						{
							Id = 1,
							Name = "Clinica A",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),

						},
						new Clinic
						{
							Id = 2,
							Name = "Clinica B",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),

						},
						new Clinic
						{
							Id = 3,
							Name = "Clinica C",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),

						}
					);

					context.SaveChanges();
				}

				if (!context.FrontDesks.Any())
				{
					context.FrontDesks.AddRange(
						new FrontDesk
						{
							Id = 1,
							Name = "admin+frontdesk@dentalhub.com",
							Login = "admin+frontdesk@dentalhub.com",
							Password = "zZPvN9",
							ClinicId = 1,
							Cpf = "00000000000",
							Telephone = "00000000000",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						},
						new FrontDesk
						{
							Id = 2,
							Name = "Michael Smith",
							Login = "michael_smith",
							Password = "Smith1234",
							ClinicId = 2,
							Cpf = "12345678901",
							Telephone = "11 98765-4321",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						},
						new FrontDesk
						{
							Id = 3,
							Name = "Emily Johnson",
							Login = "emily_johnson",
							Password = "Password7890",
							ClinicId = 2,
							Cpf = "98765432109",
							Telephone = "21 98765-1234",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						},
						new FrontDesk
						{
							Id = 4,
							Name = "David Garcia",
							Login = "david_garcia",
							Password = "Garcia5678",
							ClinicId = 3,
							Cpf = "45678912345",
							Telephone = "41 99999-9999",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						},
						new FrontDesk
						{
							Id = 5,
							Name = "Jasmine Doe",
							Login = "jasmine_doe",
							Password = "Password1123",
							ClinicId = 2,
							Cpf = "58765981006",
							Telephone = "35 99984-2211",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						}
					);

					context.SaveChanges();
				}

				if (!context.Affiliateds.Any())
				{
					context.Affiliateds.AddRange(
						new Affiliated
						{
							Id = 1,
							Name = "admin+teacher@dentalhub.com",
							Login = "admin+teacher@dentalhub.com",
							Password = "zZPvN9",
							Email = "admin+teacher@dentalhub.com",
							Telephone = "35800000000",
							Registry = "0000000000",
							Cpf = "0000000000",
							IsTeacher = true,
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						},
						new Affiliated
						{
							Id = 2,
							Name = "admin+student@dentalhub.com",
							Login = "admin+student@dentalhub.com",
							Password = "zZPvN9",
							Email = "admin+student@dentalhub.com",
							Telephone = "35800000000",
							Registry = "0000000000",
							Cpf = "0000000000",
							IsTeacher = false,
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						}
					);

					context.SaveChanges();
				}

				if (!context.Admins.Any())
				{
					context.Admins.AddRange(
						new Admin
						{
							ID = 1,
							Name = "admin+mod@dentalhub.com",
							Login = "admin+mod@dentalhub.com",
							Email = "admin+mod@dentalhub.com",
							Password = "zZPvN9",
							UpdatedAt = DateTime.Now.ToUniversalTime(),
							CreatedAt = DateTime.Now.ToUniversalTime(),
						}
					);
					context.SaveChanges();
				}
			}
		}

	}
}
