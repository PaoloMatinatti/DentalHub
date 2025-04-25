import ScreeningPanel from "@/components/templates/patient/datasheet/screening";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Triagem do Paciente",
};

const TeacherPatientDetail = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<ScreeningPanel
				data={{
					patientId: params.slug,
					treatmentId: params.screening,
				}}
				view={2}
			/>
		</Grid>
	);
};

export default TeacherPatientDetail;
