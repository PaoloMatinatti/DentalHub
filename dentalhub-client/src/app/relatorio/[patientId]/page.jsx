import RelatorioFicha from "@/components/templates/patient/report";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Relátorio",
};

const Relatorio = async ({ params: { patientId } }) => {
	return (
		<Grid container justifyContent={"center"}>
			<RelatorioFicha id={patientId} />
		</Grid>
	);
};

export default Relatorio;
