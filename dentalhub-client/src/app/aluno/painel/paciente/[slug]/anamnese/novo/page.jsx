import AnamnesePanel from "@/components/templates/patient/datasheet/anamnese";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Nova Anamnese",
};

const StudentPatientDetail = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<AnamnesePanel
				data={{
					patientId: params.slug,
					treatmentId: null,
				}}
			/>
		</Grid>
	);
};

export default StudentPatientDetail;
