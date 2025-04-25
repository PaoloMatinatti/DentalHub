import TreatmentPanel from "@/components/templates/patient/datasheet/treatments";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Tratamento",
};

const StudentPatientDetail = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<TreatmentPanel
				data={{
					patientId: params.slug,
					treatmentId: params.treatment,
				}}
			/>
		</Grid>
	);
};

export default StudentPatientDetail;
