"use client";

import React, { useState } from "react";
import {
	Button,
	ButtonBase,
	Card,
	CardContent,
	CardHeader,
	Grid,
	TextField,
	Typography,
	useMediaQuery,
} from "@mui/material";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Image from "next/image";
import dental from "@/services/dental-api";
import { useRouter } from "next/navigation";
import { useTheme } from "@emotion/react";
import { checkIsPediatric, formatDate } from "@/utils/date";
import Link from "next/link";
import { useUser } from "@/providers/user-provider";
import TreatmentListByPatient from "./treatments/list-by-patient";
import AnamneseCard from "./anamnese/card";
import { protectedRoutes } from "@/app/routes";
import ModalAlertas from "../modal-highlights";
import AtmCard from "./atm/card";
import PeriodontalCard from "./periodontal/card";
import ScreeningCard from "./screening/card";

const handleClick = () => {};

const DetalhesPaciente = ({ data, view }) => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
	const router = useRouter();
	const isPatient = view == 1;

	const [isModal, setModalState] = useState(false);
	const modalState = [isModal, setModalState];

	const [isLoaded, setIsLoaded] = useState(false);
	const [patient, setPatient] = useState(null);

	const { user } = useUser();

	React.useEffect(() => {
		const getPatientData = async () => {
			if ((!data && !isPatient) || (!data && !user?.id)) return;

			try {
				const response = await dental.patients.getById(
					data || user?.id,
				);

				setPatient({
					...response,
					isPediatric: !checkIsPediatric(
						new Date(response.birthDate),
					),
				});
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoaded(true);
			}
		};

		getPatientData();
	}, [data, view, user, isPatient]);

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
							defaultValue={patient?.name}
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
					</div>
					<div
						style={{
							display: "flex",
							gap: "16px",
							flexWrap: "wrap",
						}}
						alt="chip status"
					>
						{false && <ModalAlertas state={modalState} />}
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
						href={`${!isPatient ? patient?.id + "/" : "painel/"}dados`}
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

					{isPatient ? (
						<ButtonBase
							onClick={handleClick}
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
									<Typography>Baixar relatório</Typography>
									<Typography
										color={"#2E7D32"}
										variant="body2"
									>
										100%
									</Typography>
								</CardContent>
								<Image
									src={cardDatasheet}
									alt="Imagem Ilustrativa"
								/>
							</Card>
						</ButtonBase>
					) : (
						<>
							<ButtonBase
								component={Link}
								href={`${!isPatient ? patient?.id + "/" : "painel/"}termos`}
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
										<Typography>Autorizações</Typography>
									</CardContent>
									<Image
										src={cardDatasheet}
										alt="Imagem Ilustrativa"
									/>
								</Card>
							</ButtonBase>
						</>
					)}
				</Grid>
				{!isPatient && (
					<>
						<Typography color={"#A1A1AA"}>Prontuários:</Typography>
						<Grid
							container
							justifyContent={{ xs: "center", md: "normal" }}
							mb={2}
							gap={3}
						>
							<AnamneseCard patient={patient} view={view} />

							<ScreeningCard patient={patient} view={view} />

							<PeriodontalCard patient={patient} view={view} />

							<AtmCard patient={patient} view={view} />
						</Grid>

						<TreatmentListByPatient patient={patient} view={view} />
					</>
				)}
				<div
					style={{
						display: "flex",
						flexDirection: "row-reverse",
						justifyContent: isSmallScreen && "center",
					}}
				>
					{!isPatient && (
						<Button
							LinkComponent={Link}
							href={`${protectedRoutes[user.userType - 1]}`}
							variant="text"
							color="neutral"
							sx={{
								width: "262px",
							}}
						>
							Voltar
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default DetalhesPaciente;
