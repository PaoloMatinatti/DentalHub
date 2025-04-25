import PatientDetails from "@/components/templates/patient/details";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Dados do Paciente",
};

const ReceiptionPatientDetail = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<PatientDetails data={params.slug} view={3} />
		</Grid>
	);
};

export default ReceiptionPatientDetail;
