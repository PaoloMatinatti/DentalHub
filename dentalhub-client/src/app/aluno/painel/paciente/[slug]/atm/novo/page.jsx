import ATM from "@/components/templates/patient/datasheet/atm";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Nova Anamnese",
};

const StudentPatientDetail = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<ATM
				data={{
					patientId: params.slug,
					treatmentId: null,
				}}
			/>
		</Grid>
	);
};

export default StudentPatientDetail;
