"use client";

import React, { useState } from "react";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	Grid,
	TextField,
} from "@mui/material";
import dental from "@/services/dental-api";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/user-provider";
import Link from "next/link";
import TreatmentListByTreatment from "../../patient/datasheet/treatments/list-by-treatments";

const PerfilAluno = ({ data, view }) => {
	const router = useRouter();
	const isPatient = view == 1;

	const [isLoaded, setIsLoaded] = useState(false);
	const [student, setStudent] = useState(null);
	const [treatments, setTreatments] = useState([]);

	const { user } = useUser();

	React.useEffect(() => {
		const getPatientData = async () => {
			if ((!data && !isPatient) || (!data && !user?.id)) return;

			try {
				const responseStudent = await dental.affiliated.getById(
					data || user?.id,
				);

				if (responseStudent.id) {
					const responseTreatments =
						await dental.form.treatment.getByAffiliated(
							data || user?.id,
						);

					setStudent({
						...responseStudent,
					});

					setTreatments(responseTreatments);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoaded(true);
			}
		};

		getPatientData();
	}, [data, view, user, isPatient]);

	if (data && !student && isLoaded) {
		return router.back();
	}

	return (
		<Card
			sx={{
				maxWidth: "100%",
				width: "100%",
				margin: "auto",
				mt: 9,
				mb: 9,
			}}
		>
			<CardHeader
				title={"Informações do Aluno"}
				sx={{
					paddingTop: "60px",
					width: "100%",
					backgroundColor: "#DADCE0",
					mb: "1rem",
				}}
			/>

			<CardContent
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "16px",
				}}
			>
				<Grid
					pb={3}
					style={{ borderBottom: "1px solid #E0E0E0" }}
					container
					justifyContent={{ xs: "center", md: "space-between" }}
					mb={2}
					gap={2}
				>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							flexDirection: "column",
						}}
					>
						<div
							style={{
								display: "flex",
								gap: "16px",
							}}
						>
							<TextField
								InputLabelProps={{
									shrink: !!student || undefined,
								}}
								disabled
								name="name"
								label="Nome do Aluno"
								defaultValue={student?.name}
								variant="outlined"
								inputProps={{
									maxLength: 50,
								}}
							/>
							<TextField
								InputLabelProps={{
									shrink: !!student || undefined,
								}}
								disabled
								name="name"
								label="Mátricula"
								defaultValue={student?.registry}
								variant="outlined"
								inputProps={{
									maxLength: 50,
								}}
							/>
						</div>
					</div>
				</Grid>

				<TreatmentListByTreatment list={treatments} />

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Button
						LinkComponent={Link}
						href="../"
						variant="text"
						color="neutral"
						sx={{
							width: "262px",
						}}
					>
						Voltar
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default PerfilAluno;
