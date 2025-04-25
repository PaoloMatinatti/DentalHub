import DrawCanvas from "@/components/templates/patient/datasheet/atm/draw";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Mapa Periodontal",
};

export default function StudentPatientMap({ params }) {
	return (
		<Grid container flexWrap={"nowrap"}>
			<DrawCanvas
				data={{
					patientId: params.slug,
					treatmentId: params.atm,
				}}
				view={4}
			/>
		</Grid>
	);
}
