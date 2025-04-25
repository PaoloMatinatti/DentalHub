using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dentalhub_api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMigrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Treatments_Screenings_ScreeningId",
                table: "Treatments");

            migrationBuilder.DropIndex(
                name: "IX_Treatments_ScreeningId",
                table: "Treatments");

            migrationBuilder.DropColumn(
                name: "ScreeningId",
                table: "Treatments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ScreeningId",
                table: "Treatments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Treatments_ScreeningId",
                table: "Treatments",
                column: "ScreeningId");

            migrationBuilder.AddForeignKey(
                name: "FK_Treatments_Screenings_ScreeningId",
                table: "Treatments",
                column: "ScreeningId",
                principalTable: "Screenings",
                principalColumn: "Id");
        }
    }
}
