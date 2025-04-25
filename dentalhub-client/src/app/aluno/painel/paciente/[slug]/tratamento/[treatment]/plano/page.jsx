import PlanoCronologico from "@/components/templates/patient/datasheet/treatments/chronological";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Tratamento - Plano Cronológico",
};

const StudentPatientPLan = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<PlanoCronologico data={params.slug} view={4} />
		</Grid>
	);
};

export default StudentPatientPLan;
