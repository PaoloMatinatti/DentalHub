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
import dental from "@/services/dental-api";
import routes from "@/app/routes";
import { useRouter } from "next/navigation";
import { useFrontdesk } from "@/providers/frontdesk-provider";
import { toast } from "sonner";

const FormOtherPediatricData = ({
	event,
	patient,
	setPatient,
	handleContinueButtonClick,
	handleBackButtonClick,
	disableSaveAndEdit,
}) => {
	const [submitLoading, setSubmitLoading] = useState(false);
	const router = useRouter();
	const { handleBookPresence } = useFrontdesk();

	const handleSaveAndBook = async (event) => {
		event.preventDefault();

		if (disableSaveAndEdit) {
			return handleContinueButtonClick();
		}

		setSubmitLoading(true);

		let hasDifference = false;

		const data = new FormData(event.target.form);

		const formData = {
			schoolName: data.get("schoolName"),
			schoolSeries: data.get("schoolSeries"),
			schoolShift: parseInt(data.get("schoolShift")),
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
				const response = await dental.patients.setPediatricInfos(
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
			schoolName: data.get("schoolName"),
			schoolSeries: data.get("schoolSeries"),
			schoolShift: parseInt(data.get("schoolShift")),
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
				const response = await dental.patients.setPediatricInfos(
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
	};

	return (
		<Box display="flex" flexDirection="column" justifyContent="center">
			<form
				style={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
					gap: "1.6rem",
					marginBottom: "2rem",
					borderLeft: "1px solid #e0e0e0",
					height: "192px",
				}}
				autoComplete="off"
			>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "center",
						gap: "1.6rem",
					}}
				>
					<TextField
						disabled={disableSaveAndEdit}
						id={`${event}-field-1`}
						name="schoolName"
						label={`Escola`}
						variant="outlined"
						defaultValue={patient?.schoolName}
						inputProps={{
							maxLength: 50,
						}}
					/>
					<TextField
						disabled={disableSaveAndEdit}
						id={`${event}-field-1`}
						name="schoolSeries"
						label={`Série`}
						variant="outlined"
						defaultValue={patient?.schoolSeries}
						inputProps={{
							maxLength: 20,
						}}
					/>
					<FormControl
						variant="outlined"
						required
						sx={{ minWidth: 210 }}
					>
						<InputLabel id={`${event}-turno-label`}>
							Turno
						</InputLabel>
						<Select
							labelId={`${event}-turno-label`}
							name="schoolShift"
							id={`${event}-turno`}
							disabled={disableSaveAndEdit}
							label="Turno"
							required={true}
							defaultValue={patient?.schoolShift}
						>
							<MenuItem value={0}>Matutino</MenuItem>
							<MenuItem value={1}>Vespertino </MenuItem>
							<MenuItem value={2}>Noturno</MenuItem>
						</Select>
					</FormControl>
				</div>

				<div
					style={{
						display: "flex",
						gap: "1.8rem",
						width: "95%",
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
							width: "210px",
						}}
					>
						Voltar
					</Button>

					{(!disableSaveAndEdit || patient.isDependent) && (
						<>
							{!patient.isDependent && (
								<Button
									disabled={
										submitLoading || disableSaveAndEdit
									}
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
								disabled={submitLoading}
								type="button"
								onClick={handleSaveAndBook}
								variant="contained"
								sx={{
									marginRight: "1.5rem",
									width: "100%",
								}}
							>
								{!patient.isDependent
									? "Salvar e Marcar Presença"
									: "Próximo"}
							</Button>
						</>
					)}
				</div>
			</form>
		</Box>
	);
};

export default FormOtherPediatricData;
