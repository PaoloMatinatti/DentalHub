import PatientDetails from "@/components/templates/patient/details";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Cadastrar Paciente",
};

const ReceptionCreate = () => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<PatientDetails hiddenTabs view={3} />
		</Grid>
	);
};

export default ReceptionCreate;
