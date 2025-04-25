import PatientSelection from "@/components/patients/search";
import PresenceList from "@/components/presence/list";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Painel de Controle",
};

const ReceptionPanel = () => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<Grid item xs={12}>
				<PatientSelection view={3} />
			</Grid>
			<Grid item xs={12}>
				<PresenceList />
			</Grid>
		</Grid>
	);
};

export default ReceptionPanel;
