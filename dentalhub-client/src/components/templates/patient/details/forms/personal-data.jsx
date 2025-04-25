"use client";

import {
	TextField,
	Box,
	Switch,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormLabel,
} from "@mui/material";
import React, { useState } from "react";
import dental from "@/services/dental-api";
import routes, { protectedRoutes } from "@/app/routes";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/date";
import Link from "next/link";

const FormPersonalData = ({
	event,
	patient,
	hiddenTabs,
	setPatient,
	handleContinueButtonClick,
	disableSaveAndEdit,
	view,
}) => {
	const router = useRouter();
	const [submitLoading, setSubmitLoading] = useState(false);

	const handleNumericInput = (e) => {
		e.target.value = e.target.value.replace(/[^0-9]/g, "");
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			key={patient?.id || 0}
		>
			<form
				style={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: "1.6rem",
					borderLeft: "1px solid #e0e0e0",
				}}
				autoComplete="off"
				onSubmit={async (event) => {
					event.preventDefault();

					if (disableSaveAndEdit) {
						return handleContinueButtonClick();
					}

					setSubmitLoading(true);

					let hasDifference = false;

					const data = new FormData(event.target);

					const formData = {
						name: data.get("name"),
						gender: parseInt(data.get("gender")),
						ethnicGroup: parseInt(data.get("ethnicGroup")),
						nationality: data.get("nationality"),
						susNationalCard: data.get("susNationalCard"),
						susRegionalCard: data.get("susRegionalCard"),
						isDependent:
							data.get("isDependent") == "on" ? true : false,
					};

					if (patient == null) {
						formData.birthDate = new Date(
							data.get("birthDate"),
						).toISOString();

						try {
							const response =
								await dental.patients.create(formData);
							router.push(
								routes.panels.frontdesk.patient.details.path +
									"/" +
									response.id,
							);
						} catch (error) {
							console.error(error);
						} finally {
							setSubmitLoading(false);
						}
					} else {
						Object.keys(formData).forEach((key) => {
							if (
								(patient[key] == null &&
									formData[key] != null) ||
								(patient[key] != null &&
									formData[key] != patient[key])
							) {
								hasDifference = true;
							}
						});

						if (hasDifference) {
							try {
								const response = await dental.patients.update(
									patient.id,
									formData,
								);
								setPatient((value) => ({
									...value,
									...response,
								}));
							} catch (error) {
								console.error(error);
							} finally {
								setSubmitLoading(false);
							}
						}
						handleContinueButtonClick();
					}
				}}
			>
				<TextField
					disabled={disableSaveAndEdit}
					id={`${event}-field-1`}
					InputLabelProps={{
						shrink: !!patient || undefined,
					}}
					name="name"
					label="Nome Completo"
					sx={{ width: hiddenTabs ? "300px" : "210px" }}
					defaultValue={patient?.name}
					variant="outlined"
					required={true}
					inputProps={{
						maxLength: 50,
					}}
				/>
				<TextField
					id={`${event}-field-2`}
					label="Data de Nascimento"
					name="birthDate"
					type="date"
					variant="outlined"
					InputLabelProps={{
						shrink: true,
					}}
					value={
						patient?.birthDate
							? formatDate(patient.birthDate)
							: undefined
					}
					sx={{ width: hiddenTabs ? "300px" : "210px" }}
					required={true}
					style={{
						pointerEvents:
							!!patient || disableSaveAndEdit ? "none" : "auto",
						"-webkit-text-fill-color":
							!!patient || disableSaveAndEdit
								? "rgba(0, 0, 0, 0.38)"
								: "unset",
					}}
				/>

				<TextField
					disabled={disableSaveAndEdit}
					id={`${event}-field-5`}
					label="Naturalidade"
					sx={{ width: hiddenTabs ? "300px" : "210px" }}
					InputLabelProps={{
						shrink: !!patient || undefined,
					}}
					name="nationality"
					defaultValue={patient?.nationality}
					variant="outlined"
					inputProps={{
						maxLength: 20,
					}}
				/>
				<FormControl variant="outlined" required sx={{ minWidth: 210 }}>
					<InputLabel id={`${event}-field-6-label`}>
						Sexo/Gênero
					</InputLabel>
					<Select
						disabled={disableSaveAndEdit}
						labelId={`${event}-field-6-label`}
						id={`${event}-field-6`}
						sx={{ width: hiddenTabs ? "300px" : "210px" }}
						InputLabelProps={{
							shrink: !!patient || undefined,
						}}
						name="gender"
						label="Sexo/Gênero"
						defaultValue={patient?.gender}
					>
						<MenuItem value={0}>Masculino</MenuItem>
						<MenuItem value={1}>Feminino</MenuItem>
						<MenuItem value={2}>Outros</MenuItem>
					</Select>
				</FormControl>
				<FormControl variant="outlined" required sx={{ minWidth: 210 }}>
					<InputLabel id={`${event}-field-7-label`}>
						Grupo Étnico
					</InputLabel>
					<Select
						disabled={disableSaveAndEdit}
						labelId={`${event}-field-7-label`}
						id={`${event}-field-7`}
						sx={{ width: hiddenTabs ? "300px" : "210px" }}
						label="Grupo Étnico"
						defaultValue={patient?.ethnicGroup}
						InputLabelProps={{
							shrink: !!patient || undefined,
						}}
						name="ethnicGroup"
					>
						<MenuItem value={0}>Indigena</MenuItem>
						<MenuItem value={1}>Afro Brasileiro</MenuItem>
						<MenuItem value={2}>Branco</MenuItem>
						<MenuItem value={3}>Asiatico</MenuItem>
						<MenuItem value={4}>Pardo</MenuItem>
						<MenuItem value={5}>Outro</MenuItem>
					</Select>
				</FormControl>

				<TextField
					disabled={disableSaveAndEdit}
					id={`${event}-field-8`}
					label="Cartão Nacional do SUS"
					sx={{ width: hiddenTabs ? "300px" : "210px" }}
					InputLabelProps={{
						shrink: !!patient || undefined,
					}}
					name="susNationalCard"
					variant="outlined"
					required={true}
					defaultValue={patient?.susNationalCard}
					inputProps={{
						maxLength: 15,
						onInput: handleNumericInput,
					}}
				/>
				<TextField
					disabled={disableSaveAndEdit}
					id={`${event}-field-9`}
					label="Cartão Regional do SUS"
					sx={{ width: hiddenTabs ? "300px" : "210px" }}
					InputLabelProps={{
						shrink: !!patient || undefined,
					}}
					name="susRegionalCard"
					variant="outlined"
					defaultValue={patient?.susRegionalCard}
					inputProps={{
						maxLength: 15,
						onInput: handleNumericInput,
					}}
				/>

				<div
					style={{
						display: "flex",
						gap: "1.8rem",
					}}
				>
					<FormLabel>
						<Switch
							name="isDependent"
							disabled={disableSaveAndEdit}
							defaultChecked={patient?.isDependent}
						/>
						Precisa de responsável?
					</FormLabel>
					<Button
						variant="outlined"
						LinkComponent={Link}
						href={
							view == 3 || view == 1
								? `${protectedRoutes[view - 1]}`
								: `${protectedRoutes[view - 1]}/paciente/${patient?.id}`
						}
						sx={{
							width: hiddenTabs ? "300px" : "210px",
						}}
					>
						Voltar
					</Button>
					<Button
						disabled={submitLoading}
						type="submit"
						variant="contained"
						sx={{
							marginRight: "1.5rem",
							width: hiddenTabs ? "300px" : "210px",
						}}
					>
						{patient ? "Próximo" : "Cadastrar"}
					</Button>
				</div>
			</form>
		</Box>
	);
};

export default FormPersonalData;
