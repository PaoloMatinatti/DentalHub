"use client";

import React from "react";
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
import { useUser } from "@/providers/user-provider";
import { useTreatment } from "@/providers/treatment-provider";
import { handleStatusColor, handleStatusMessage } from "@/utils/text";
import { Visibility } from "@mui/icons-material";
import { toast } from "sonner";
import { protectedRoutes } from "@/app/routes";
import Link from "next/link";
import { uncompressValue } from "@/utils/encode";
import Builder from "@/components/core/builder";
import atmForm from "@/form/atm.json";
import ModalParaValidacao from "../../modal-to-validate";
import ModalValidacao from "../../modal-validation";
import DrawCard from "./draw/card";

const ATM = ({ data: { patientId, treatmentId: atmId }, view = 4 }) => {
	const router = useRouter();
	const { treatment, handleUpdateTreatment } = useTreatment();

	const [isLoaded, setIsLoaded] = React.useState(false);

	const modalState = React.useState(false);
	const [isModalOpen, setIsModalOpen] = modalState;

	const [isConfirmed, setIsConfirmed] = React.useState(false);

	const [answersList, setAnswersList] = React.useState([]);
	const [isValidating, setIsValidating] = React.useState(
		treatment?.status == "Validando",
	);

	const { user } = useUser();
	const isNew = atmId == null;
	const isTeacher = view == 2;

	React.useEffect(() => {
		if (isNew || treatment != null || treatment != undefined) return;

		const getATM = async () => {
			try {
				const response = await dental.form.atm.getById(atmId);

				if (response.patientId != patientId)
					return toast.warning("ATM inválida.");

				handleUpdateTreatment(response);
				setIsValidating(response?.status == "Validando");
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoaded(true);
			}
		};

		getATM();
	}, [handleUpdateTreatment, isNew, treatment, atmId, patientId]);

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

	if (atmId && !treatment?.id && isLoaded) {
		toast.error("Erro ao buscar ATM");
		return router.push(
			protectedRoutes[view - 1] || "/paciente/" + patientId,
		);
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
				title={isNew ? "Nova ATM" : "ATM do Paciente"}
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
								const response = await dental.form.atm.create({
									patientId,
									index: new Date().toLocaleDateString(),
									studentId: user.id,
								});

								router.push(
									`/aluno/painel/paciente/${patientId}/atm/${response.id}`,
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
							Informações sobre a ATM:
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
								label="ATM do Dia:"
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
					<>
						<Typography color={"#A1A1AA"}>Items:</Typography>
						<Grid
							container
							justifyContent={{ xs: "center", md: "normal" }}
							mb={2}
							gap={3}
							pb={3}
							style={{ borderBottom: "1px solid #E0E0E0" }}
						>
							<DrawCard atm={treatment} />

							{!isTeacher && false && (
								<ButtonBase
									onClick={async () => {
										if (!isConfirmed)
											return setIsConfirmed(true);

										try {
											await dental.form.treatment.close(
												atmId,
											);

											toast.success(
												"Tratamento Fechado com Sucesso",
											);

											return router.push(
												`/aluno/painel/paciente/${patientId}`,
											);
										} catch (error) {
											console.error(error);
										}
									}}
									style={{
										textAlign: "left",
										maxWidth: "100%",
									}}
								>
									<Card
										style={{
											width: "352px",
											height: "80px",
											display: "flex",
											justifyContent: "space-between",
											borderRadius: "12px",
											border:
												`1px solid` +
												(isConfirmed
													? "#FF0000"
													: undefined),
										}}
									>
										<CardContent>
											<Typography
												style={{
													fontWeight: "bold",
												}}
											>
												{isConfirmed
													? "Confirmar Fechamento"
													: "Fechar ATM"}
											</Typography>
											{isConfirmed && (
												<Typography variant="body2">
													Clique novamente para fechar
												</Typography>
											)}
										</CardContent>
										<Image
											src={cardDatasheet}
											alt="Imagem Ilustrativa"
										/>
									</Card>
								</ButtonBase>
							)}
						</Grid>

						<Builder.Root
							file={atmForm}
							disabled={isTeacher || (!isTeacher && isValidating)}
							targetName="atm"
							data={{
								patientId,
								atmId,
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
													"Essa ATM não está disponível para validação.",
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
													"ATM em validação",
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
					</>
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
					<Typography style={{ fontSize: "14px", color: "#A9A8AA" }}>
						Para atualizar suas informações, visite a Clínica
						Odontológica na Unifenas.
					</Typography>
				</div>
			</CardContent>

			{isModalOpen && !isTeacher && (
				<ModalParaValidacao
					state={modalState}
					list={answersList}
					data={{ patientId, studentId: user?.id, atmId }}
					targetName="atm"
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
					targetName="atm"
					state={modalState}
				/>
			)}
		</Card>
	);
};

export default ATM;
