"use client";

import { useUser } from "@/providers/user-provider";
import dental from "@/services/dental-api";
import { Avatar, Box, ButtonBase, Card, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function generateHref(validation, slugName) {
	let href;

	if (validation && validation.patientId && validation.treatmentId) {
		if (slugName == "Mapa Periodontal") {
			href = `painel/paciente/${validation.patientId}/mapa`;
		} else if (slugName == "Plano Cronológico") {
			href = `painel/paciente/${validation.patientId}/tratamento/${validation.treatmentId}/plano`;
		} else if (slugName == "Desenho de Dor") {
			href = `painel/paciente/${validation.patientId}/atm/${validation.treatmentId}/desenho`;
		} else {
			href = `painel/paciente/${validation.patientId}/${slugName.toLowerCase()}/${validation.treatmentId}`;
		}
	} else {
		href = "#";
	}

	return href;
}

const ValidationList = () => {
	const { user } = useUser();
	const router = useRouter();

	const [isLoaded, setIsLoaded] = React.useState(false);
	const [teacher, setTeacher] = React.useState(null);
	const [validations, setValidations] = React.useState([]);

	React.useEffect(() => {
		const getTeacherData = async () => {
			if (!user?.id) return;

			try {
				const responseTeacher = await dental.affiliated.getById(
					user.id,
				);

				setTeacher(responseTeacher);
				setValidations(responseTeacher.validations);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoaded(true);
			}
		};

		getTeacherData();
	}, [user]);

	if (!teacher && isLoaded) {
		return router.back();
	}

	return (
		<Box>
			<Typography variant="body1" mb={3}>
				{!validations?.length
					? "Não há validações solicitadas."
					: "Solicitação de Validação:"}
			</Typography>
			<Grid container gap={3}>
				{validations.map((validation, index) => {
					return (
						<ButtonBase
							LinkComponent={Link}
							href={generateHref(
								validation,
								validation?.treatmentName,
							)}
							key={index}
						>
							<Card
								variant="outlined"
								style={{
									display: "flex",
									gap: "16px",
									width: "268px",
									height: "100%",
									maxHeight: "80px",
									padding: "16px",
									borderRadius: "12px",
								}}
							>
								<Avatar
									sx={{
										bgcolor: "primary.main",
									}}
									aria-label="recipe"
								>
									{validation?.patientName?.[0]}
								</Avatar>{" "}
								<div>
									<Typography
										style={{
											fontWeight: "bold",
											width: "160px",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{validation?.patientName}
									</Typography>
									<Typography
										color="neutral.main"
										variant="body2"
									>
										Verificar: {validation?.treatmentName}
									</Typography>
								</div>
							</Card>
						</ButtonBase>
					);
				})}
			</Grid>
		</Box>
	);
};

export default ValidationList;
