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
	Skeleton,
	Typography,
} from "@mui/material";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Image from "next/image";
import { useUser } from "@/providers/user-provider";
import { TipTap } from "./text-editor";
import { useTreatment } from "@/providers/treatment-provider";
import Link from "next/link";
import { toast } from "sonner";
import dental from "@/services/dental-api";
import ModalValidacao from "../../../modal-validation";
import { handleStatusColor, handleStatusMessage } from "@/utils/text";
import ModalValitePlan from "./modal-validate";
import { Visibility } from "@mui/icons-material";

const PlanoCronologico = ({ view = 4 }) => {
	const { user } = useUser();
	const { treatment, handleUpdateTreatment } = useTreatment();
	const isTeacher = view == 2;

	const modalState = React.useState(false);
	const [isModalOpen, setIsModalOpen] = modalState;
	const [isValidating, setIsValidating] = React.useState(false);

	const chronologicalPlans = React.useMemo(() => {
		return {
			all: treatment?.chronologicalPlans || [],
			active:
				treatment?.chronologicalPlans.filter(
					(plan) => plan.endedAt == null,
				)?.[0] || null,
			old:
				treatment?.chronologicalPlans.filter(
					(plan) => plan.endedAt != null,
				) || [],
		};
	}, [treatment]);

	const handleSubmit = async (content) => {
		if (
			content == "" ||
			content == "<p></p>" ||
			content == chronologicalPlans?.active?.content ||
			!content
		)
			return toast.error("Conteúdo inválido.");

		try {
			if (!treatment?.id || !user?.id) return;

			await dental.form.plans.create({
				content,
				treatmentId: treatment.id,
				studentId: user.id,
			});

			toast.success("Novo plano salvo com sucesso.");

			const response = await dental.form.treatment.getById(treatment.id);

			handleUpdateTreatment(response);
		} catch (error) {
			console.error(error);
		}
	};

	React.useEffect(() => {
		setIsValidating(chronologicalPlans?.active?.status == "Validando");
	}, [chronologicalPlans]);

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
				title={"Tratamento " + treatment?.name + ": Plano Cronológico"}
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
						<Typography>Plano Cronológico</Typography>
						{chronologicalPlans.active && (
							<Typography variant="body2" color={"#A1A1AA"}>
								Última Edição Por:{" "}
								{chronologicalPlans?.active?.lastEditName}
							</Typography>
						)}
					</div>

					<div>
						{chronologicalPlans.all.length == 0 ? (
							<Chip
								label="Novo Plano"
								variant="outlined"
								color="primary"
							/>
						) : isValidating ? (
							<Chip
								label={handleStatusMessage("Validando")}
								variant="filled"
								color={handleStatusColor("Validando")}
							/>
						) : (
							<Chip
								label={handleStatusMessage(
									chronologicalPlans.active.status,
								)}
								variant="filled"
								color={handleStatusColor(
									chronologicalPlans.active.status,
								)}
							/>
						)}
					</div>
				</Grid>

				{chronologicalPlans.active?.feedback && (
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

							<Typography>
								{chronologicalPlans?.active?.feedback}
							</Typography>
						</CardContent>
					</Card>
				)}

				{treatment ? (
					<TipTap
						defaultValue={chronologicalPlans?.active?.content}
						callback={handleSubmit}
						disabled={isTeacher || (!isTeacher && isValidating)}
					/>
				) : (
					<Skeleton height={400} width={"100%"} mt={0} />
				)}

				{chronologicalPlans.active && !isTeacher && (
					<Typography
						variant="body2"
						mt={isValidating ? null : -5.6}
						mb={3}
						color={"#A1A1AA"}
					>
						Se você salvar, será gerado um novo Plano. O anterior
						ainda estará disponível para visualização.
					</Typography>
				)}

				{!!chronologicalPlans.old.length && (
					<>
						<Typography color={"#A1A1AA"}>
							Planos Anteriores:
						</Typography>
						<Grid
							container
							justifyContent={{ xs: "center", md: "normal" }}
							mb={2}
							gap={3}
							pb={3}
							style={{ borderBottom: "1px solid #E0E0E0" }}
						>
							{chronologicalPlans.old.map((plan, index) => {
								return (
									<ButtonBase
										key={index}
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
											}}
										>
											<CardContent>
												<Typography>
													{new Date(
														plan.createdAt,
													).toLocaleDateString()}
												</Typography>
												<Typography
													color={handleStatusColor(
														plan.status,
													)}
													variant="body2"
												>
													{handleStatusMessage(
														plan.status,
													)}
												</Typography>
											</CardContent>
											<Image
												src={cardDatasheet}
												alt="Imagem Ilustrativa"
											/>
										</Card>
									</ButtonBase>
								);
							})}
						</Grid>
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
						href="./"
						variant="text"
						color="neutral"
						sx={{
							width: "262px",
						}}
					>
						Voltar
					</Button>

					{chronologicalPlans.active &&
						(isTeacher ? (
							<Button
								onClick={() => {
									if (!isValidating)
										return toast.warning(
											"Não está disponível para validação.",
										);

									setIsModalOpen(true);
								}}
								variant="outlined"
								sx={{
									width: "262px",
								}}
							>
								Validar
							</Button>
						) : (
							<Button
								onClick={() => {
									if (isValidating)
										return toast.warning(
											"Já está em validação.",
										);

									setIsModalOpen(true);
								}}
								variant="outlined"
								sx={{
									width: "262px",
								}}
							>
								Enviar para validação
							</Button>
						))}
				</div>
			</CardContent>

			{isModalOpen && isTeacher && chronologicalPlans.active && (
				<ModalValidacao
					data={{
						treatmentId: chronologicalPlans.active.id,
						validationId:
							chronologicalPlans.active?.currentValidationId,
					}}
					targetName="plans"
					state={modalState}
				/>
			)}

			{isModalOpen && !isTeacher && (
				<ModalValitePlan
					data={{
						planId: chronologicalPlans?.active?.id,
						studentId: user?.id,
					}}
					setIsValidating={setIsValidating}
					state={modalState}
				/>
			)}
		</Card>
	);
};

export default PlanoCronologico;
