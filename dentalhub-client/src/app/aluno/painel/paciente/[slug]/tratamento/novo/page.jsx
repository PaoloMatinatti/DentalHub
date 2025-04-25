import TreatmentPanel from "@/components/templates/patient/datasheet/treatments";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Novo Tratamento",
};

const StudentPatientDetail = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<TreatmentPanel
				data={{
					patientId: params.slug,
					treatmentId: null,
				}}
			/>
		</Grid>
	);
};

export default StudentPatientDetail;
