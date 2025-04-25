import PresenceList from "@/components/presence/list";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Painel de Controle",
};

export default function StudentPanel() {
	return (
		<Grid container flexWrap={"nowrap"}>
			<Grid item xs={24}>
				<PresenceList view={4} />
			</Grid>
		</Grid>
	);
}
