import AnamnesePanel from "@/components/templates/patient/datasheet/anamnese";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Anamnese do Paciente",
};

const TeacherPatientDetail = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<AnamnesePanel
				data={{
					patientId: params.slug,
					treatmentId: params.anamnese,
				}}
			/>
		</Grid>
	);
};

export default TeacherPatientDetail;
