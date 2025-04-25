"use client";

import React from "react";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	Chip,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import dental from "@/services/dental-api";
import { useUser } from "@/providers/user-provider";
import { useTreatment } from "@/providers/treatment-provider";
import { protectedRoutes } from "@/app/routes";
import { toast } from "sonner";

import Builder from "@/components/core/builder";
import screeningForm from "@/form/triagem.json";
import Link from "next/link";
import { ArrowBackIos, Visibility } from "@mui/icons-material";
import { uncompressValue } from "@/utils/encode";

import ModalParaValidacao from "../../modal-to-validate";
import ModalValidacao from "../../modal-validation";
import { handleStatusColor, handleStatusMessage } from "@/utils/text";

const ScreeningPanel = ({
	data: { patientId, treatmentId: screeningId },
	view = 4,
}) => {
	const router = useRouter();
	const { user } = useUser();
	const { treatment, handleUpdateTreatment } = useTreatment();

	const [isLoaded, setIsLoaded] = React.useState(false);
	const [answersList, setAnswersList] = React.useState([]);

	const modalState = React.useState(false);
	const [isModalOpen, setIsModalOpen] = modalState;

	const [isValidating, setIsValidating] = React.useState(false);

	const getDatabaseAnswers = React.useCallback(() => {
		let answersArray = {};

		treatment?.answers?.map(({ content, question, id }) => {
			const initialAnswer = {
				...uncompressValue(content),
				id,
			};

			answersArray[question] = {
				...initialAnswer,
			};
		});

		return {
			...answersArray,
		};
	}, [treatment?.answers]);

	const isNew = screeningId == null;
	const isTeacher = view == 2;

	React.useEffect(() => {
		if (isNew || treatment != null || treatment != undefined) return;

		const getTriagem = async () => {
			try {
				const response =
					await dental.form.screening.getById(screeningId);

				if (response.patientId != patientId)
					return toast.warning("Triagem inválida.");

				handleUpdateTreatment(response);

				setIsValidating(response?.status == "Validando");
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoaded(true);
			}
		};

		getTriagem();
	}, [handleUpdateTreatment, isNew, treatment, screeningId, patientId]);

	if (screeningId && !treatment && isLoaded) {
		toast.error("Erro ao buscar tratamento");
		return router.push(
			protectedRoutes[view - 1] || "/paciente/" + patientId,
		);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				marginTop: "5rem",
				marginBottom: "5rem",
				maxWidth: "100%",
				width: "100%",
			}}
		>
			<div>
				<Button LinkComponent={Link} href={`../`}>
					<ArrowBackIos />
					Voltar para o painel
				</Button>
			</div>
			<Card
				sx={{
					maxWidth: "100%",
					width: "100%",
					margin: "auto",
					mt: 2,
					mb: 9,
				}}
			>
				<CardHeader
					title={isNew ? "Nova Triagem" : "Triagem do Paciente"}
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
						<form
							onSubmit={async (event) => {
								event.preventDefault();

								try {
									const response =
										await dental.form.screening.create({
											patientId,
											index: new Date().toLocaleDateString(),
											studentId: user.id,
										});

									router.push(
										`/aluno/painel/paciente/${patientId}/triagem/${response.id}`,
									);
								} catch (error) {
									console.error(error);
								}
							}}
							style={{
								display: "flex",
								width: isNew ? "100%" : "auto",
								flexWrap: "wrap",
								flexDirection: "column",
							}}
						>
							<Typography color={"#A1A1AA"} pb={3}>
								Informações sobre a Triagem:
							</Typography>
							<div
								style={{
									width: isNew ? "100%" : "auto",
									display: "flex",
									gap: "16px",
								}}
							>
								<TextField
									sx={{
										width: isNew ? "100%" : "auto",
										flex: 1,
									}}
									InputLabelProps={{
										shrink: !isNew || undefined,
									}}
									disabled
									label="Triagem do Dia:"
									value={
										isNew
											? new Date().toLocaleDateString()
											: treatment?.index
									}
									variant="outlined"
									inputProps={{
										maxLength: 50,
									}}
								/>
								{isNew && (
									<Button type="submit" variant="contained">
										Criar Nova
									</Button>
								)}
							</div>
						</form>

						{treatment?.status && (
							<Chip
								label={handleStatusMessage(treatment?.status)}
								variant="contained"
								color={handleStatusColor(treatment?.status)}
							/>
						)}
					</Grid>

					{treatment?.feedback && (
						<Card variant="outlined">
							<CardContent>
								<Typography
									variant="h6"
									marginBottom={2}
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}
								>
									<Visibility /> Observação:
								</Typography>

								<Typography>{treatment?.feedback}</Typography>
							</CardContent>
						</Card>
					)}

					{!isNew && (
						<Builder.Root
							file={screeningForm}
							disabled={isTeacher || (!isTeacher && isValidating)}
							targetName="screening"
							data={{
								patientId,
								screeningId,
								answers: getDatabaseAnswers(),
							}}
						>
							<Builder.List />

							<Grid
								container
								flexDirection={"row"}
								justifyContent={"flex-end"}
								marginBottom={4}
								gap={3}
							>
								{isTeacher ? (
									<Builder.Trigger
										disabled={!isValidating}
										callback={async () => {
											if (!isValidating)
												return toast.warning(
													"Essa Triagem não está disponível para validação.",
												);
											setIsModalOpen(true);
										}}
									>
										<Button variant="contained">
											Validar
										</Button>
									</Builder.Trigger>
								) : (
									<Builder.Trigger
										callback={async (answers) => {
											if (isValidating)
												return toast.warning(
													"Triagem em validação",
												);

											let answerIdList = [];
											let hasChanges = false;

											const databaseAnswers =
												getDatabaseAnswers();

											Object.keys(answers).forEach(
												(key) => {
													answerIdList.push(
														answers?.[key].id,
													);

													if (
														(!databaseAnswers[
															key
														] &&
															answers[key]) ||
														answers[key].id !=
															databaseAnswers[key]
																.id
													) {
														hasChanges = true;
													}
												},
											);

											if (!answerIdList.length)
												return toast.error(
													"Você esqueceu de salvar alguma pergunta.",
												);

											if (!hasChanges)
												return toast.error(
													"As respostas são as mesmas da validação passada.",
												);

											setAnswersList(answerIdList);
											setIsModalOpen(true);
										}}
									>
										<Button
											variant="contained"
											disabled={isValidating}
										>
											Enviar para aprovação
										</Button>
									</Builder.Trigger>
								)}
							</Grid>
						</Builder.Root>
					)}

					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<Button
							LinkComponent={Link}
							href={`../`}
							variant="text"
							color="neutral"
							sx={{
								width: "262px",
							}}
						>
							Voltar
						</Button>
						<Typography
							style={{ fontSize: "14px", color: "#A9A8AA" }}
						>
							Para atualizar suas informações, visite a Clínica
							Odontológica na Unifenas.
						</Typography>
					</div>
				</CardContent>
			</Card>

			{isModalOpen && !isTeacher && (
				<ModalParaValidacao
					state={modalState}
					list={answersList}
					data={{
						patientId,
						studentId: user?.id,
						screeningId,
					}}
					targetName="screening"
					setIsValidating={setIsValidating}
				/>
			)}

			{isModalOpen && isTeacher && (
				<ModalValidacao
					data={{
						treatmentId: treatment?.id,
						validationId: treatment?.currentValidationId,
						patientId,
					}}
					targetName="screening"
					state={modalState}
				/>
			)}
		</div>
	);
};

export default ScreeningPanel;
