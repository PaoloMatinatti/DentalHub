import { Grid } from "@mui/material";
import DetalhesPaciente from "./components/datasheet";

export const metadata = {
	title: "Ficha de Paciente",
};

const PatientPanel = () => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<DetalhesPaciente view={1} />
		</Grid>
	);
};

export default PatientPanel;
