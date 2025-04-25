"use client";

import {
	TextField,
	Box,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import InputMask from "react-input-mask";
import dental from "@/services/dental-api";
import routes from "@/app/routes";
import { formatDate } from "@/utils/date";
import { useRouter } from "next/navigation";
import { removeSpecialCharacters } from "@/utils/text";
import { useFrontdesk } from "@/providers/frontdesk-provider";
import { toast } from "sonner";

const FormOtherData = ({
	event,
	patient,
	setPatient,
	handleBackButtonClick,
	handleContinueButtonClick,
	disableSaveAndEdit,
	hiddenTabs,
}) => {
	const [submitLoading, setSubmitLoading] = useState(false);
	const { handleBookPresence } = useFrontdesk();
	const router = useRouter();
	const [emailError, setEmailError] = useState(false);

	const handleEmailChange = (e) => {
		const email = e.target.value;
		setEmailError(!email.includes("@"));
	};

	const handleSaveAndBook = async (event) => {
		event.preventDefault();

		if (disableSaveAndEdit) {
			return handleContinueButtonClick();
		}

		setSubmitLoading(true);

		let hasDifference = false;

		const data = new FormData(event.target.form);

		const formData = {
			occupation: data.get("occupation"),
			phone: data.get("phone"),
			email: data.get("email"),
			civilStatus: parseInt(data.get("civilStatus")),
			cpf: removeSpecialCharacters(data.get("cpf")),
			rg: data.get("rg"),
			expeditionRG: new Date(data.get("expeditionRG")).toISOString(),
			recommendation: data.get("recommendation"),
			fatherName: data.get("fatherName"),
			motherName: data.get("motherName"),
		};

		Object.keys(formData).forEach((key) => {
			if (
				(patient[key] == null && formData[key]) ||
				(patient[key] && formData[key] != patient[key])
			) {
				hasDifference = true;
			}
		});

		if (hasDifference) {
			try {
				const response = await dental.patients.setRegularInfos(
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
		if (patient.isDependent) {
			handleContinueButtonClick();
		} else {
			await handleBookPresence(patient?.id);
			router.push(routes.panels.frontdesk.path);
		}

		setSubmitLoading(false);
	};

	const handleSave = async (event) => {
		event.preventDefault();

		if (disableSaveAndEdit) {
			return handleContinueButtonClick();
		}

		setSubmitLoading(true);

		let hasDifference = false;

		const data = new FormData(event.target.form);

		const formData = {
			occupation: data.get("occupation"),
			phone: data.get("phone"),
			email: data.get("email"),
			civilStatus: parseInt(data.get("civilStatus")),
			cpf: removeSpecialCharacters(data.get("cpf")),
			rg: data.get("rg"),
			expeditionRG: new Date(data.get("expeditionRG")).toISOString(),
			recommendation: data.get("recommendation"),
			fatherName: data.get("fatherName"),
			motherName: data.get("motherName"),
		};

		Object.keys(formData).forEach((key) => {
			if (
				(patient[key] == null && formData[key]) ||
				(patient[key] && formData[key] != patient[key])
			) {
				hasDifference = true;
			}
		});

		if (hasDifference) {
			try {
				const response = await dental.patients.setRegularInfos(
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
		if (patient.isDependent) {
			handleContinueButtonClick();
		} else {
			toast.success("Salvo com sucesso.");
		}

		setSubmitLoading(false);
	};

	return (
		<Box display="flex" flexDirection="column" justifyContent="center">
			<form
				style={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: "1.6rem",
					marginBottom: "2rem",
					borderLeft: "1px solid #e0e0e0",
				}}
				autoComplete="off"
			>
				<TextField
					disabled={disableSaveAndEdit}
					id={`${event}-field-3`}
					label="E-mail"
					variant="outlined"
					InputLabelProps={{
						shrink: !!patient || undefined,
					}}
					name="email"
					defaultValue={patient?.email}
					required={!patient?.isPediatric}
					onChange={handleEmailChange}
					error={emailError}
					sx={{ width: hiddenTabs ? "300px" : "210px" }}
					inputProps={{
						maxLength: 60,
					}}
				/>
				<InputMask
					mask="(99) 99999-9999"
					maskChar={null}
					defaultValue={patient?.phone}
				>
					{() => (
						<TextField
							id={`${event}-field-4`}
							InputLabelProps={{
								shrink: !!patient || undefined,
							}}
							style={{
								pointerEvents: disableSaveAndEdit
									? "none"
									: "auto",
								"-webkit-text-fill-color": disableSaveAndEdit
									? "rgba(0, 0, 0, 0.38)"
									: "unset",
							}}
							name="phone"
							label="Telefone"
							variant="outlined"
							required={true}
							sx={{
								width: hiddenTabs ? "300px" : "210px",
							}}
						/>
					)}
				</InputMask>
				<TextField
					disabled={disableSaveAndEdit}
					id={`${event}-profissao`}
					name="occupation"
					label="Profissão"
					variant="outlined"
					required={true}
					defaultValue={patient?.occupation}
					inputProps={{
						maxLength: 20,
					}}
				/>
				<FormControl variant="outlined" required sx={{ minWidth: 210 }}>
					<InputLabel id={`${event}-estado-civil-label`}>
						Estado Civil
					</InputLabel>
					<Select
						disabled={disableSaveAndEdit}
						labelId={`${event}-estado-civil-label`}
						id={`${event}-estado-civil`}
						name="civilStatus"
						label="Estado Civil"
						required={true}
						defaultValue={patient?.civilStatus}
					>
						<MenuItem value={1}>Solteiro(a)</MenuItem>
						<MenuItem value={2}>Casado(a)</MenuItem>
						<MenuItem value={3}>Divorciado(a)</MenuItem>
						<MenuItem value={4}>Viúvo(a)</MenuItem>
						<MenuItem value={5}>Separado</MenuItem>
						<MenuItem value={6}>União Estável</MenuItem>
						<MenuItem value={7}>Outro</MenuItem>
					</Select>
				</FormControl>
				<InputMask
					mask="999.999.999-99"
					maskChar={null}
					defaultValue={patient?.cpf}
				>
					{() => (
						<TextField
							style={{
								pointerEvents: disableSaveAndEdit
									? "none"
									: "auto",
								"-webkit-text-fill-color": disableSaveAndEdit
									? "rgba(0, 0, 0, 0.38)"
									: "unset",
							}}
							id={`${event}-cpf`}
							name="cpf"
							label="CPF"
							variant="outlined"
							required={true}
						/>
					)}
				</InputMask>
				<TextField
					disabled={disableSaveAndEdit}
					id={`${event}-rg`}
					name="rg"
					label="RG"
					variant="outlined"
					defaultValue={patient?.rg}
					inputProps={{
						maxLength: 14,
					}}
				/>
				<TextField
					disabled={disableSaveAndEdit}
					id={`${event}-data-expedicao-rg`}
					name="expeditionRG"
					label="Data de Expedição do RG"
					type="date"
					variant="outlined"
					sx={{ minWidth: 210 }}
					required={true}
					defaultValue={
						patient?.expeditionRG
							? formatDate(patient.expeditionRG)
							: undefined
					}
					InputLabelProps={{
						shrink: true,
					}}
				/>
				<TextField
					disabled={disableSaveAndEdit}
					id={`${event}-encaminhado-por`}
					name="recommendation"
					label="Encaminhado por"
					variant="outlined"
					defaultValue={patient?.recommendation}
					inputProps={{
						maxLength: 20,
					}}
				/>
				<TextField
					disabled={disableSaveAndEdit}
					id={`${event}-nome-pai`}
					name="fatherName"
					label="Nome do pai"
					variant="outlined"
					defaultValue={patient?.fatherName}
					inputProps={{
						maxLength: 50,
					}}
				/>
				<TextField
					disabled={disableSaveAndEdit}
					id={`${event}-nome-mae`}
					name="motherName"
					label="Nome da mãe"
					variant="outlined"
					defaultValue={patient?.motherName}
					inputProps={{
						maxLength: 50,
					}}
				/>

				<div
					style={{
						display: "flex",
						width: "95%",
						gap: "1.8rem",
					}}
				>
					<Button
						variant="outlined"
						{...(() => {
							if (!patient) {
								return {
									href: routes.panels.frontdesk.path,
								};
							}

							return {
								onClick: handleBackButtonClick,
							};
						})()}
						sx={{
							width: "100%",
						}}
					>
						Voltar
					</Button>

					{!disableSaveAndEdit && (
						<Button
							disabled={submitLoading || disableSaveAndEdit}
							type="button"
							onClick={handleSave}
							variant="contained"
							color="info"
							sx={{
								marginRight: "1.5rem",
								width: "100%",
							}}
						>
							Salvar
						</Button>
					)}

					<Button
						disabled={submitLoading || disableSaveAndEdit}
						type="button"
						onClick={handleSaveAndBook}
						variant="contained"
						sx={{
							marginRight: "1.5rem",
							width: "100%",
						}}
					>
						{disableSaveAndEdit
							? "Próximo"
							: !patient.isDependent
								? "Salvar e Marcar Presença"
								: "Próximo"}
					</Button>
				</div>
			</form>
		</Box>
	);
};

export default FormOtherData;
