"use client";

import React from "react";
import {
	Button,
	ButtonBase,
	Card,
	CardContent,
	CardHeader,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dental from "@/services/dental-api";
import { useUser } from "@/providers/user-provider";
import Link from "next/link";
import { useTreatment } from "@/providers/treatment-provider";
import { toast } from "sonner";

const TreatmentPanel = ({ data: { patientId, treatmentId }, view = 4 }) => {
	const router = useRouter();
	const { user } = useUser();
	const { treatment } = useTreatment();

	const isNew = treatmentId == null;
	const isTeacher = view == 2;

	const [isConfirmed, setIsConfirmed] = React.useState(false);

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
				title={isNew ? "Novo Tratamento" : "Informações do Tratamento"}
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

							const data = new FormData(event.target);

							const formData = {
								name: data.get("name"),
							};

							try {
								const response =
									await dental.form.treatment.create({
										patientId,
										name: formData.name,
										studentId: user.id,
									});

								router.push(
									`/aluno/painel/paciente/${patientId}/tratamento/${response.id}`,
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
							Informações sobre o tratamento:
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
								disabled={!isNew}
								name="name"
								required
								label="Nome do Tratamento"
								defaultValue={isNew ? "" : treatment?.name}
								variant="outlined"
								inputProps={{
									maxLength: 50,
								}}
							/>

							{isNew && (
								<Button type="submit" variant="contained">
									Criar Novo
								</Button>
							)}
						</div>
					</form>
				</Grid>
				{!isNew && (
					<>
						<Typography color={"#A1A1AA"}>Prontuários:</Typography>
						<Grid
							container
							justifyContent={{ xs: "center", md: "normal" }}
							mb={2}
							gap={3}
							pb={3}
							style={{ borderBottom: "1px solid #E0E0E0" }}
						>
							<ButtonBase
								component={Link}
								href={`${treatmentId}/plano`}
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
										<Typography
											style={{ fontWeight: "bold" }}
										>
											Plano Cronológico
										</Typography>
										<Typography
											color="neutral.main"
											variant="body2"
										>
											Verificar
										</Typography>
									</CardContent>
									<Image
										src={cardDatasheet}
										alt="Imagem Ilustrativa"
									/>
								</Card>
							</ButtonBase>
							{!isTeacher && (
								<ButtonBase
									onClick={async () => {
										if (!isConfirmed)
											return setIsConfirmed(true);

										try {
											await dental.form.treatment.close(
												treatmentId,
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
													: "Fechar Tratamento"}
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
						href="../"
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
		</Card>
	);
};

export default TreatmentPanel;
