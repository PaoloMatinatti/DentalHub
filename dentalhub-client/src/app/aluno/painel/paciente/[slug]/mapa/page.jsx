import PeriodontalCanvas from "@/components/templates/patient/datasheet/periodontal";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Mapa Periodontal",
};

export default function StudentPatientMap({ params }) {
	return (
		<Grid container flexWrap={"nowrap"}>
			<PeriodontalCanvas data={params.slug} view={4} />
		</Grid>
	);
}
