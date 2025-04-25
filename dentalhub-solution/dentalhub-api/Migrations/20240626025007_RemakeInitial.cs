using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace dentalhub_api.Migrations
{
    /// <inheritdoc />
    public partial class RemakeInitial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Uf = table.Column<int>(type: "integer", nullable: false),
                    Number = table.Column<string>(type: "text", nullable: false),
                    Cep = table.Column<string>(type: "text", nullable: true),
                    Telephone = table.Column<string>(type: "text", nullable: false),
                    District = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    Street = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ID = table.Column<int>(type: "integer", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Login = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Clinics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clinics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Patient",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Token = table.Column<string>(type: "text", nullable: true),
                    BirthDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsDependent = table.Column<bool>(type: "boolean", nullable: true),
                    SusRegionalCard = table.Column<string>(type: "text", nullable: true),
                    SusNationalCard = table.Column<string>(type: "text", nullable: true),
                    Nationality = table.Column<string>(type: "text", nullable: true),
                    Gender = table.Column<int>(type: "integer", nullable: false),
                    EthnicGroup = table.Column<int>(type: "integer", nullable: false),
                    AddressId = table.Column<int>(type: "integer", nullable: true),
                    Discriminator = table.Column<string>(type: "character varying(21)", maxLength: 21, nullable: false),
                    SchoolName = table.Column<string>(type: "text", nullable: true),
                    SchoolSeries = table.Column<string>(type: "text", nullable: true),
                    SchoolShift = table.Column<int>(type: "integer", nullable: true),
                    Occupation = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    ExpeditionRG = table.Column<string>(type: "text", nullable: true),
                    Rg = table.Column<string>(type: "text", nullable: true),
                    CivilStatus = table.Column<int>(type: "integer", nullable: true),
                    Cpf = table.Column<string>(type: "text", nullable: true),
                    Recommendation = table.Column<string>(type: "text", nullable: true),
                    FatherName = table.Column<string>(type: "text", nullable: true),
                    MotherName = table.Column<string>(type: "text", nullable: true),
                    ComercialAddressId = table.Column<int>(type: "integer", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Login = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patient", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Patient_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Patient_Addresses_ComercialAddressId",
                        column: x => x.ComercialAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FrontDesks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClinicId = table.Column<int>(type: "integer", nullable: false),
                    Cpf = table.Column<string>(type: "text", nullable: false),
                    Telephone = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Login = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FrontDesks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FrontDesks_Clinics_ClinicId",
                        column: x => x.ClinicId,
                        principalTable: "Clinics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Responsibles",
                columns: table => new
                {
                    ResponsibleId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    RegularPatientId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Responsibles", x => x.ResponsibleId);
                    table.ForeignKey(
                        name: "FK_Responsibles_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Responsibles_Patient_RegularPatientId",
                        column: x => x.RegularPatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Terms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Terms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Terms_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Presences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IsEmergency = table.Column<bool>(type: "boolean", nullable: true),
                    ClinicId = table.Column<int>(type: "integer", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    FrontdeskId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Exit = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Presences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Presences_Clinics_ClinicId",
                        column: x => x.ClinicId,
                        principalTable: "Clinics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Presences_FrontDesks_FrontdeskId",
                        column: x => x.FrontdeskId,
                        principalTable: "FrontDesks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Presences_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Affiliateds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Telephone = table.Column<string>(type: "text", nullable: true),
                    Registry = table.Column<string>(type: "text", nullable: true),
                    Cpf = table.Column<string>(type: "text", nullable: true),
                    IsTeacher = table.Column<bool>(type: "boolean", nullable: true),
                    AnamneseId = table.Column<int>(type: "integer", nullable: true),
                    AtmId = table.Column<int>(type: "integer", nullable: true),
                    ScreeningId = table.Column<int>(type: "integer", nullable: true),
                    TreatmentId = table.Column<int>(type: "integer", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Login = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Affiliateds", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PeriodontalCharts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Url = table.Column<string>(type: "text", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastStudentEditId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PeriodontalCharts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PeriodontalCharts_Affiliateds_LastStudentEditId",
                        column: x => x.LastStudentEditId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PeriodontalCharts_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PeriodontalChartValidations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AttachmentId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: true),
                    Feedback = table.Column<string>(type: "text", nullable: true),
                    TeacherId = table.Column<int>(type: "integer", nullable: false),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PeriodontalChartValidations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PeriodontalChartValidations_Affiliateds_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PeriodontalChartValidations_Affiliateds_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PeriodontalChartValidations_PeriodontalCharts_AttachmentId",
                        column: x => x.AttachmentId,
                        principalTable: "PeriodontalCharts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnamneseAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AnamneseId = table.Column<int>(type: "integer", nullable: true),
                    ValidationId = table.Column<int>(type: "integer", nullable: true),
                    Question = table.Column<string>(type: "text", nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true),
                    Highlight = table.Column<bool>(type: "boolean", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnamneseAnswers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Anamneses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Index = table.Column<string>(type: "text", nullable: true),
                    CurrentValidationId = table.Column<int>(type: "integer", nullable: true),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Anamneses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Anamneses_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AnamneseValidations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AnamneseId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: true),
                    Feedback = table.Column<string>(type: "text", nullable: true),
                    TeacherId = table.Column<int>(type: "integer", nullable: false),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnamneseValidations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnamneseValidations_Affiliateds_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnamneseValidations_Affiliateds_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnamneseValidations_Anamneses_AnamneseId",
                        column: x => x.AnamneseId,
                        principalTable: "Anamneses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AtmAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AtmId = table.Column<int>(type: "integer", nullable: true),
                    ValidationId = table.Column<int>(type: "integer", nullable: true),
                    Question = table.Column<string>(type: "text", nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true),
                    Highlight = table.Column<bool>(type: "boolean", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AtmAnswers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Atms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Index = table.Column<string>(type: "text", nullable: true),
                    CurrentValidationId = table.Column<int>(type: "integer", nullable: true),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Atms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Atms_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AtmValidations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AtmId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: true),
                    Feedback = table.Column<string>(type: "text", nullable: true),
                    TeacherId = table.Column<int>(type: "integer", nullable: false),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AtmValidations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AtmValidations_Affiliateds_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AtmValidations_Affiliateds_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AtmValidations_Atms_AtmId",
                        column: x => x.AtmId,
                        principalTable: "Atms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PainDraws",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Url = table.Column<string>(type: "text", nullable: false),
                    AtmId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastStudentEditId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PainDraws", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PainDraws_Affiliateds_LastStudentEditId",
                        column: x => x.LastStudentEditId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PainDraws_Atms_AtmId",
                        column: x => x.AtmId,
                        principalTable: "Atms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PainDrawValidations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AttachmentId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: true),
                    Feedback = table.Column<string>(type: "text", nullable: true),
                    TeacherId = table.Column<int>(type: "integer", nullable: false),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PainDrawValidations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PainDrawValidations_Affiliateds_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PainDrawValidations_Affiliateds_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PainDrawValidations_PainDraws_AttachmentId",
                        column: x => x.AttachmentId,
                        principalTable: "PainDraws",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChronologicalPlans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Content = table.Column<string>(type: "text", nullable: false),
                    TreatmentId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastStudentEditId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChronologicalPlans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChronologicalPlans_Affiliateds_LastStudentEditId",
                        column: x => x.LastStudentEditId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChronologicalPlanValidations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AttachmentId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: true),
                    Feedback = table.Column<string>(type: "text", nullable: true),
                    TeacherId = table.Column<int>(type: "integer", nullable: false),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChronologicalPlanValidations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChronologicalPlanValidations_Affiliateds_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChronologicalPlanValidations_Affiliateds_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChronologicalPlanValidations_ChronologicalPlans_AttachmentId",
                        column: x => x.AttachmentId,
                        principalTable: "ChronologicalPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Exams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Content = table.Column<string>(type: "text", nullable: false),
                    TreatmentId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastStudentEditId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Exams_Affiliateds_LastStudentEditId",
                        column: x => x.LastStudentEditId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ScreeningAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ScreeningId = table.Column<int>(type: "integer", nullable: true),
                    ValidationId = table.Column<int>(type: "integer", nullable: true),
                    Question = table.Column<string>(type: "text", nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true),
                    Highlight = table.Column<bool>(type: "boolean", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScreeningAnswers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Screenings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Index = table.Column<string>(type: "text", nullable: true),
                    CurrentValidationId = table.Column<int>(type: "integer", nullable: true),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Screenings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Screenings_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ScreeningValidations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ScreeningId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: true),
                    Feedback = table.Column<string>(type: "text", nullable: true),
                    TeacherId = table.Column<int>(type: "integer", nullable: false),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScreeningValidations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScreeningValidations_Affiliateds_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ScreeningValidations_Affiliateds_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "Affiliateds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ScreeningValidations_Screenings_ScreeningId",
                        column: x => x.ScreeningId,
                        principalTable: "Screenings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Treatments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    ScreeningId = table.Column<int>(type: "integer", nullable: true),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Treatments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Treatments_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Treatments_Screenings_ScreeningId",
                        column: x => x.ScreeningId,
                        principalTable: "Screenings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Affiliateds_AnamneseId",
                table: "Affiliateds",
                column: "AnamneseId");

            migrationBuilder.CreateIndex(
                name: "IX_Affiliateds_AtmId",
                table: "Affiliateds",
                column: "AtmId");

            migrationBuilder.CreateIndex(
                name: "IX_Affiliateds_ScreeningId",
                table: "Affiliateds",
                column: "ScreeningId");

            migrationBuilder.CreateIndex(
                name: "IX_Affiliateds_TreatmentId",
                table: "Affiliateds",
                column: "TreatmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AnamneseAnswers_AnamneseId",
                table: "AnamneseAnswers",
                column: "AnamneseId");

            migrationBuilder.CreateIndex(
                name: "IX_AnamneseAnswers_ValidationId",
                table: "AnamneseAnswers",
                column: "ValidationId");

            migrationBuilder.CreateIndex(
                name: "IX_Anamneses_CurrentValidationId",
                table: "Anamneses",
                column: "CurrentValidationId");

            migrationBuilder.CreateIndex(
                name: "IX_Anamneses_PatientId",
                table: "Anamneses",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_AnamneseValidations_AnamneseId",
                table: "AnamneseValidations",
                column: "AnamneseId");

            migrationBuilder.CreateIndex(
                name: "IX_AnamneseValidations_StudentId",
                table: "AnamneseValidations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_AnamneseValidations_TeacherId",
                table: "AnamneseValidations",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_AtmAnswers_AtmId",
                table: "AtmAnswers",
                column: "AtmId");

            migrationBuilder.CreateIndex(
                name: "IX_AtmAnswers_ValidationId",
                table: "AtmAnswers",
                column: "ValidationId");

            migrationBuilder.CreateIndex(
                name: "IX_Atms_CurrentValidationId",
                table: "Atms",
                column: "CurrentValidationId");

            migrationBuilder.CreateIndex(
                name: "IX_Atms_PatientId",
                table: "Atms",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_AtmValidations_AtmId",
                table: "AtmValidations",
                column: "AtmId");

            migrationBuilder.CreateIndex(
                name: "IX_AtmValidations_StudentId",
                table: "AtmValidations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_AtmValidations_TeacherId",
                table: "AtmValidations",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_ChronologicalPlans_LastStudentEditId",
                table: "ChronologicalPlans",
                column: "LastStudentEditId");

            migrationBuilder.CreateIndex(
                name: "IX_ChronologicalPlans_TreatmentId",
                table: "ChronologicalPlans",
                column: "TreatmentId");

            migrationBuilder.CreateIndex(
                name: "IX_ChronologicalPlanValidations_AttachmentId",
                table: "ChronologicalPlanValidations",
                column: "AttachmentId");

            migrationBuilder.CreateIndex(
                name: "IX_ChronologicalPlanValidations_StudentId",
                table: "ChronologicalPlanValidations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_ChronologicalPlanValidations_TeacherId",
                table: "ChronologicalPlanValidations",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_LastStudentEditId",
                table: "Exams",
                column: "LastStudentEditId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_TreatmentId",
                table: "Exams",
                column: "TreatmentId");

            migrationBuilder.CreateIndex(
                name: "IX_FrontDesks_ClinicId",
                table: "FrontDesks",
                column: "ClinicId");

            migrationBuilder.CreateIndex(
                name: "IX_PainDraws_AtmId",
                table: "PainDraws",
                column: "AtmId");

            migrationBuilder.CreateIndex(
                name: "IX_PainDraws_LastStudentEditId",
                table: "PainDraws",
                column: "LastStudentEditId");

            migrationBuilder.CreateIndex(
                name: "IX_PainDrawValidations_AttachmentId",
                table: "PainDrawValidations",
                column: "AttachmentId");

            migrationBuilder.CreateIndex(
                name: "IX_PainDrawValidations_StudentId",
                table: "PainDrawValidations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_PainDrawValidations_TeacherId",
                table: "PainDrawValidations",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_Patient_AddressId",
                table: "Patient",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Patient_ComercialAddressId",
                table: "Patient",
                column: "ComercialAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_PeriodontalCharts_LastStudentEditId",
                table: "PeriodontalCharts",
                column: "LastStudentEditId");

            migrationBuilder.CreateIndex(
                name: "IX_PeriodontalCharts_PatientId",
                table: "PeriodontalCharts",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PeriodontalChartValidations_AttachmentId",
                table: "PeriodontalChartValidations",
                column: "AttachmentId");

            migrationBuilder.CreateIndex(
                name: "IX_PeriodontalChartValidations_StudentId",
                table: "PeriodontalChartValidations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_PeriodontalChartValidations_TeacherId",
                table: "PeriodontalChartValidations",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_Presences_ClinicId",
                table: "Presences",
                column: "ClinicId");

            migrationBuilder.CreateIndex(
                name: "IX_Presences_FrontdeskId",
                table: "Presences",
                column: "FrontdeskId");

            migrationBuilder.CreateIndex(
                name: "IX_Presences_PatientId",
                table: "Presences",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Responsibles_PatientId",
                table: "Responsibles",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Responsibles_RegularPatientId",
                table: "Responsibles",
                column: "RegularPatientId");

            migrationBuilder.CreateIndex(
                name: "IX_ScreeningAnswers_ScreeningId",
                table: "ScreeningAnswers",
                column: "ScreeningId");

            migrationBuilder.CreateIndex(
                name: "IX_ScreeningAnswers_ValidationId",
                table: "ScreeningAnswers",
                column: "ValidationId");

            migrationBuilder.CreateIndex(
                name: "IX_Screenings_CurrentValidationId",
                table: "Screenings",
                column: "CurrentValidationId");

            migrationBuilder.CreateIndex(
                name: "IX_Screenings_PatientId",
                table: "Screenings",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_ScreeningValidations_ScreeningId",
                table: "ScreeningValidations",
                column: "ScreeningId");

            migrationBuilder.CreateIndex(
                name: "IX_ScreeningValidations_StudentId",
                table: "ScreeningValidations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_ScreeningValidations_TeacherId",
                table: "ScreeningValidations",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_Terms_PatientId",
                table: "Terms",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Treatments_PatientId",
                table: "Treatments",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Treatments_ScreeningId",
                table: "Treatments",
                column: "ScreeningId");

            migrationBuilder.AddForeignKey(
                name: "FK_Affiliateds_Anamneses_AnamneseId",
                table: "Affiliateds",
                column: "AnamneseId",
                principalTable: "Anamneses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Affiliateds_Atms_AtmId",
                table: "Affiliateds",
                column: "AtmId",
                principalTable: "Atms",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Affiliateds_Screenings_ScreeningId",
                table: "Affiliateds",
                column: "ScreeningId",
                principalTable: "Screenings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Affiliateds_Treatments_TreatmentId",
                table: "Affiliateds",
                column: "TreatmentId",
                principalTable: "Treatments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AnamneseAnswers_AnamneseValidations_ValidationId",
                table: "AnamneseAnswers",
                column: "ValidationId",
                principalTable: "AnamneseValidations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AnamneseAnswers_Anamneses_AnamneseId",
                table: "AnamneseAnswers",
                column: "AnamneseId",
                principalTable: "Anamneses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Anamneses_AnamneseValidations_CurrentValidationId",
                table: "Anamneses",
                column: "CurrentValidationId",
                principalTable: "AnamneseValidations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AtmAnswers_AtmValidations_ValidationId",
                table: "AtmAnswers",
                column: "ValidationId",
                principalTable: "AtmValidations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AtmAnswers_Atms_AtmId",
                table: "AtmAnswers",
                column: "AtmId",
                principalTable: "Atms",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Atms_AtmValidations_CurrentValidationId",
                table: "Atms",
                column: "CurrentValidationId",
                principalTable: "AtmValidations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChronologicalPlans_Treatments_TreatmentId",
                table: "ChronologicalPlans",
                column: "TreatmentId",
                principalTable: "Treatments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Treatments_TreatmentId",
                table: "Exams",
                column: "TreatmentId",
                principalTable: "Treatments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ScreeningAnswers_ScreeningValidations_ValidationId",
                table: "ScreeningAnswers",
                column: "ValidationId",
                principalTable: "ScreeningValidations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ScreeningAnswers_Screenings_ScreeningId",
                table: "ScreeningAnswers",
                column: "ScreeningId",
                principalTable: "Screenings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Screenings_ScreeningValidations_CurrentValidationId",
                table: "Screenings",
                column: "CurrentValidationId",
                principalTable: "ScreeningValidations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Affiliateds_Anamneses_AnamneseId",
                table: "Affiliateds");

            migrationBuilder.DropForeignKey(
                name: "FK_AnamneseValidations_Anamneses_AnamneseId",
                table: "AnamneseValidations");

            migrationBuilder.DropForeignKey(
                name: "FK_Affiliateds_Atms_AtmId",
                table: "Affiliateds");

            migrationBuilder.DropForeignKey(
                name: "FK_AtmValidations_Atms_AtmId",
                table: "AtmValidations");

            migrationBuilder.DropForeignKey(
                name: "FK_Affiliateds_Screenings_ScreeningId",
                table: "Affiliateds");

            migrationBuilder.DropForeignKey(
                name: "FK_ScreeningValidations_Screenings_ScreeningId",
                table: "ScreeningValidations");

            migrationBuilder.DropForeignKey(
                name: "FK_Treatments_Screenings_ScreeningId",
                table: "Treatments");

            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "AnamneseAnswers");

            migrationBuilder.DropTable(
                name: "AtmAnswers");

            migrationBuilder.DropTable(
                name: "ChronologicalPlanValidations");

            migrationBuilder.DropTable(
                name: "Exams");

            migrationBuilder.DropTable(
                name: "PainDrawValidations");

            migrationBuilder.DropTable(
                name: "PeriodontalChartValidations");

            migrationBuilder.DropTable(
                name: "Presences");

            migrationBuilder.DropTable(
                name: "Responsibles");

            migrationBuilder.DropTable(
                name: "ScreeningAnswers");

            migrationBuilder.DropTable(
                name: "Terms");

            migrationBuilder.DropTable(
                name: "ChronologicalPlans");

            migrationBuilder.DropTable(
                name: "PainDraws");

            migrationBuilder.DropTable(
                name: "PeriodontalCharts");

            migrationBuilder.DropTable(
                name: "FrontDesks");

            migrationBuilder.DropTable(
                name: "Clinics");

            migrationBuilder.DropTable(
                name: "Anamneses");

            migrationBuilder.DropTable(
                name: "AnamneseValidations");

            migrationBuilder.DropTable(
                name: "Atms");

            migrationBuilder.DropTable(
                name: "AtmValidations");

            migrationBuilder.DropTable(
                name: "Screenings");

            migrationBuilder.DropTable(
                name: "ScreeningValidations");

            migrationBuilder.DropTable(
                name: "Affiliateds");

            migrationBuilder.DropTable(
                name: "Treatments");

            migrationBuilder.DropTable(
                name: "Patient");

            migrationBuilder.DropTable(
                name: "Addresses");
        }
    }
}
