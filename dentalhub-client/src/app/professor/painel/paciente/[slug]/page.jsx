import DetalhesPaciente from "@/components/templates/patient/datasheet";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Ficha do Paciente",
};

const StudentPatientDetail = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<DetalhesPaciente data={params.slug} view={2} />
		</Grid>
	);
};

export default StudentPatientDetail;
