import PatientDetails from "@/components/templates/patient/details";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Dados do Paciente",
};

const StudentPatientDetail = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<PatientDetails data={params.slug} view={4} />
		</Grid>
	);
};

export default StudentPatientDetail;
