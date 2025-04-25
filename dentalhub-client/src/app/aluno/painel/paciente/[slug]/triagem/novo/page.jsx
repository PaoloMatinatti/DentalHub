import ScreeningPanel from "@/components/templates/patient/datasheet/screening";

import { Grid } from "@mui/material";

export const metadata = {
	title: "Nova Triagem",
};

const TeacherPatientDetail = async ({ params }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<ScreeningPanel
				data={{
					patientId: params.slug,
					treatmentId: null,
				}}
			/>
		</Grid>
	);
};

export default TeacherPatientDetail;
