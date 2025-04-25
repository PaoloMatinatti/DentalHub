import PerfilAluno from "@/components/templates/student/profile";
import { Grid } from "@mui/material";

export const metadata = {
	title: "Perfil do Aluno",
};

const StudentPatientDetail = async ({ params: { student } }) => {
	return (
		<Grid container flexWrap={"nowrap"}>
			<PerfilAluno data={student} view={2} />
		</Grid>
	);
};

export default StudentPatientDetail;
