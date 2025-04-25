import Termos from "@/components/templates/patient/datasheet/terms";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Autorizações",
};

const StudentPatientTerms = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<Termos data={params.slug} />
		</Grid>
	);
};

export default StudentPatientTerms;
