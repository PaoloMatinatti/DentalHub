/* eslint-disable no-comments/disallowComments */

"use client";

import React, { useState } from "react";
import {
	Button,
	ButtonBase,
	Card,
	CardContent,
	CardHeader,
	Chip,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Image from "next/image";
import dental from "@/services/dental-api";
import { useRouter } from "next/navigation";
import { checkIsPediatric, formatDate } from "@/utils/date";
import Link from "next/link";
import { useUser } from "@/providers/user-provider";
import ModalResponsavel from "@/components/templates/patient/modal-response";
import { usePatient } from "@/providers/patient-provider";
import { Refresh } from "@mui/icons-material";

const DetalhesPaciente = ({ data }) => {
	const { user } = useUser();
	const { patient, handleUpdatePatient, depedentList, setDependentList } =
		usePatient();

	const router = useRouter();

	const [isModal, setModalState] = useState(false);
	const modalState = [isModal, setModalState];

	const openDepedentModal = React.useCallback((list) => {
		setDependentList(list);
		setModalState(true);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [isLoaded, setIsLoaded] = useState(false);

	React.useEffect(() => {
		if (patient?.id) return;

		const getPatientData = async () => {
			if ((!data && false) || (!data && !user?.id)) return;

			try {
				const potentialPatients =
					await dental.responsibles.getDependents(user.id);

				if (potentialPatients.length <= 1) {
					const response = await dental.patients.getById(
						data || user?.id,
					);

					return handleUpdatePatient({
						...response,
						isPediatric: !checkIsPediatric(
							new Date(response.birthDate),
						),
					});
				}

				openDepedentModal(potentialPatients);
			} catch (error) {
				const response = await dental.patients.getById(
					data || user?.id,
				);

				return handleUpdatePatient({
					...response,
					isPediatric: !checkIsPediatric(
						new Date(response.birthDate),
					),
				});
			} finally {
				setIsLoaded(true);
			}
		};

		getPatientData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	if (data && !patient && isLoaded) {
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
				title={"Informações do Paciente"}
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
							gap: "16px",
							flexWrap: "wrap",
							justifyContent: "center",
						}}
					>
						<TextField
							InputLabelProps={{
								shrink: !!patient || undefined,
							}}
							disabled
							name="name"
							label="Nome Completo"
							value={patient?.name}
							variant="outlined"
							inputProps={{
								maxLength: 50,
							}}
						/>
						<TextField
							label="Data de Nascimento"
							name="birthDate"
							type="date"
							variant="outlined"
							disabled
							value={formatDate(patient?.birthDate)}
							InputLabelProps={{
								shrink: true,
							}}
							sx={{ minWidth: 210 }}
						/>

						{!!depedentList.length && (
							<Button
								variant="text"
								aria-label="Atualizar lista"
								onClick={() => setModalState(true)}
								sx={{
									gap: 1,
								}}
							>
								<Refresh />
								Trocar Paciente
							</Button>
						)}
					</div>
					<div
						style={{
							display: "flex",
							gap: "16px",
							flexWrap: "wrap",
						}}
						alt="chip status"
					>
						{false && (
							<Chip
								label="2 Alertas"
								variant="contained"
								color="error"
							/>
						)}
					</div>
				</Grid>
				<Typography color={"#A1A1AA"}>Informações:</Typography>
				<Grid
					container
					justifyContent={{ xs: "center", md: "normal" }}
					mb={2}
					gap={3}
				>
					<ButtonBase
						component={Link}
						href={`painel/dados`}
						style={{ textAlign: "left", maxWidth: "100%" }}
					>
						<Card
							style={{
								width: "352px",
								height: "80px",
								display: "flex",
								justifyContent: "space-between",
								borderRadius: "12px",
							}}
						>
							<CardContent>
								<Typography>Dados Pessoais</Typography>
							</CardContent>
							<Image
								src={cardDatasheet}
								alt="Imagem Ilustrativa"
							/>
						</Card>
					</ButtonBase>

					<ButtonBase
						component={Link}
						href={`/relatorio/${patient?.id}`}
						style={{ textAlign: "left", maxWidth: "100%" }}
					>
						<Card
							style={{
								width: "352px",
								height: "80px",
								display: "flex",
								justifyContent: "space-between",
								borderRadius: "12px",
							}}
						>
							<CardContent>
								<Typography>Ver Relatório</Typography>
							</CardContent>
							<Image
								src={cardDatasheet}
								alt="Imagem Ilustrativa"
							/>
						</Card>
					</ButtonBase>
				</Grid>
			</CardContent>

			<ModalResponsavel
				state={modalState}
				list={depedentList}
				callback={async (patient) => {
					const response = await dental.patients.getById(patient?.id);

					handleUpdatePatient({
						...response,
						isPediatric: !checkIsPediatric(
							new Date(response.birthDate),
						),
					});

					return setModalState(false);
				}}
			/>
		</Card>
	);
};

export default DetalhesPaciente;
