"use client";

import {
	Card,
	CardHeader,
	Grid,
	Tabs,
	Tab,
	useTheme,
	useMediaQuery,
	Typography,
	Button,
} from "@mui/material";
import React, { useState } from "react";
import dental from "@/services/dental-api";
import routes, { protectedRoutes } from "@/app/routes";
import { useRouter } from "next/navigation";
import FormPersonalData from "./forms/personal-data";
import FormAddressData from "./forms/address-data";
import FormOtherPediatricData from "./forms/other-pediatric-data";
import FormOtherData from "./forms/other-data";
import FormResponsibleData from "./forms/responsible-data";
import { checkIsPediatric } from "@/utils/date";
import { useUser } from "@/providers/user-provider";
import { ArrowBackIos } from "@mui/icons-material";
import Link from "next/link";
import { usePatient } from "@/providers/patient-provider";

const formList = [
	"PersonalDataForm",
	"AddressDataForm",
	"OtherDataForm",
	"OtherPediatricDataForm",
	"ResponsibleDataForm",
];

const PatientDetails = ({ data, hiddenTabs, view }) => {
	const { patient: contextPatient } = usePatient();

	const [isLoaded, setIsLoaded] = useState(false);
	const router = useRouter();
	const [patient, setPatient] = useState(contextPatient || null);
	const [showForm, setShowForm] = useState("PersonalDataForm");
	const allowTabChange = false;
	const isPatient = view == 1;
	const disableSaveAndEdit = view != 3 && view != 5;

	const { user } = useUser();

	const handleTabChange = (event, newValue) => {
		setShowForm(newValue);
	};

	const getNextIndex = (currentIndex) => {
		if (patient.isPediatric && currentIndex === 1) return currentIndex + 2;
		if (!patient.isPediatric && currentIndex === 2) return currentIndex + 2;
		return currentIndex + 1;
	};

	const getPreviousIndex = (currentIndex) => {
		if (patient.isPediatric && currentIndex === 3) return currentIndex - 2;
		if (!patient.isPediatric && currentIndex === 4) return currentIndex - 2;
		return currentIndex - 1;
	};

	const handleContinueButtonClick = () => {
		const currentIndex = formList.indexOf(showForm);
		const nextIndex = getNextIndex(currentIndex);

		if (nextIndex < formList.length) {
			setShowForm(formList[nextIndex]);
		}
	};

	const handleBackButtonClick = () => {
		const currentIndex = formList.indexOf(showForm);
		const previousIndex = getPreviousIndex(currentIndex);

		if (previousIndex >= 0) {
			setShowForm(formList[previousIndex]);
		}
	};

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	React.useEffect(() => {
		if (patient?.id) return setIsLoaded(true);

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
	}, [data, isPatient, patient?.id, user?.id]);

	if (data && !patient && isLoaded) {
		return router.push(routes.panels.frontdesk.path);
	}

	return (
		<>
			<div
				style={{
					display: "flex",
					gap: "3rem",
					flexDirection: "column",
					marginTop: "5rem",
					marginBottom: "5rem",
					maxWidth: "100%",
					width: "100%",
				}}
			>
				<div>
					<Button
						LinkComponent={Link}
						href={`${protectedRoutes[view - 1]}`}
					>
						<ArrowBackIos />
						Voltar para o painel
					</Button>
				</div>
				<Card
					sx={{
						width: "100%",
						height: "100%",
					}}
				>
					<CardHeader
						title={
							!hiddenTabs
								? "Dados do Paciente"
								: "Cadastrar Novo Paciente"
						}
						sx={{
							paddingTop: "50px",
							width: "100%",
							backgroundColor: "#DADCE0",
							mb: "1rem",
						}}
					/>
					<Grid
						display={"flex"}
						padding={"2rem 0"}
						justifyContent="space-between"
					>
						{!hiddenTabs && (
							<Tabs
								orientation={
									isSmallScreen ? "horizontal" : "vertical"
								}
								variant="scrollable"
								value={showForm}
								onChange={
									allowTabChange ? handleTabChange : null
								}
								aria-label="Vertical tabs"
								sx={{
									borderBottom: { xs: 1, md: 0 },
									borderColor: "divider",
									width: { xs: "100%", md: "30%" },
									overflowX: "hidden",
								}}
							>
								<Tab
									disabled
									label="Dados Pessoais"
									value="PersonalDataForm"
								/>
								<Tab
									disabled
									label="Dados de Endereço"
									value="AddressDataForm"
								/>
								{isLoaded && !patient.isPediatric && (
									<Tab
										disabled
										label="Outros Dados"
										value="OtherDataForm"
									/>
								)}
								{isLoaded && patient.isPediatric && (
									<Tab
										disabled
										label="Outros Dados (pediátrico)"
										value="OtherPediatricDataForm"
									/>
								)}
								{isLoaded && patient.isDependent && (
									<Tab
										disabled
										label="Responsáveis"
										value="ResponsibleDataForm"
									/>
								)}
							</Tabs>
						)}
						<Grid
							item
							xs={12}
							sm={10}
							md={8}
							lg={12}
							xl={hiddenTabs ? 12 : 8}
							sx={{
								margin: "auto",
								marginTop: { xs: "2rem", md: 0 },
								width: "100%",
							}}
						>
							{showForm === "PersonalDataForm" && (
								<FormPersonalData
									event="PersonalDataForm"
									patient={patient}
									disableSaveAndEdit={disableSaveAndEdit}
									hiddenTabs={hiddenTabs}
									setPatient={setPatient}
									handleContinueButtonClick={
										handleContinueButtonClick
									}
									handleBackButtonClick={
										handleBackButtonClick
									}
									view={view}
								/>
							)}
							{showForm === "AddressDataForm" && (
								<FormAddressData
									event="AddressDataForm"
									patient={patient}
									disableSaveAndEdit={disableSaveAndEdit}
									setPatient={setPatient}
									handleContinueButtonClick={
										handleContinueButtonClick
									}
									handleBackButtonClick={
										handleBackButtonClick
									}
									view={view}
								/>
							)}
							{showForm === "OtherDataForm" && (
								<FormOtherData
									event="OtherDataForm"
									disableSaveAndEdit={disableSaveAndEdit}
									patient={patient}
									hiddenTabs={hiddenTabs}
									setPatient={setPatient}
									handleContinueButtonClick={
										handleContinueButtonClick
									}
									handleBackButtonClick={
										handleBackButtonClick
									}
									view={view}
								/>
							)}
							{showForm === "OtherPediatricDataForm" && (
								<FormOtherPediatricData
									event="OtherPediatricDataForm"
									patient={patient}
									disableSaveAndEdit={disableSaveAndEdit}
									setPatient={setPatient}
									handleContinueButtonClick={
										handleContinueButtonClick
									}
									handleBackButtonClick={
										handleBackButtonClick
									}
									view={view}
								/>
							)}
							{showForm === "ResponsibleDataForm" && (
								<FormResponsibleData
									event="ResponsibleDataForm"
									patient={patient}
									setPatient={setPatient}
									disableSaveAndEdit={disableSaveAndEdit}
									handleContinueButtonClick={
										handleContinueButtonClick
									}
									handleBackButtonClick={
										handleBackButtonClick
									}
									view={view}
								/>
							)}
						</Grid>
					</Grid>

					<Grid>
						{view == 1 && (
							<Typography
								variant="body2"
								padding={2}
								textAlign={"center"}
							>
								Para atualizar suas informações, visite a
								Clínica Odontológica na Unifenas.
							</Typography>
						)}
					</Grid>
				</Card>
			</div>
		</>
	);
};

export default PatientDetails;
