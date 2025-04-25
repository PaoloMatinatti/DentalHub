import PatientSelection from "@/components/patients/search";
import ValidationList from "@/components/patients/validation";
import StudentSelection from "@/components/students/search";
import { Divider, Grid } from "@mui/material";

export const metadata = {
	title: "Painel de Controle",
};

export default function TeacherPanel() {
	return (
		<>
			<Grid container gap={5}>
				<Grid
					container
					flexWrap={"wrap"}
					pb={3}
					justifyContent={"space-between"}
				>
					<PatientSelection view={2} />
					<StudentSelection view={2} />
				</Grid>

				<Divider
					sx={{ borderBottom: "1px solid #E0E0E0", width: "100%" }}
				/>
				<Grid container>
					<ValidationList />
				</Grid>
			</Grid>
		</>
	);
}
