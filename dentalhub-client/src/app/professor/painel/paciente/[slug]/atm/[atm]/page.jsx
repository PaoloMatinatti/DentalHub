import ATM from "@/components/templates/patient/datasheet/atm";
import { Grid } from "@mui/material";

export const metadata = {
	title: "ATM do Paciente",
};

const TeacherPatientDetail = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<ATM
				data={{
					patientId: params.slug,
					treatmentId: params.atm,
				}}
				view={2}
			/>
		</Grid>
	);
};

export default TeacherPatientDetail;
