"use client";

import { ButtonBase, Card, CardContent, Grid, Typography } from "@mui/material";
import Image from "next/image";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Link from "next/link";

const TreatmentListByPatient = ({ patient, view = 4 }) => {
	const treatments = {
		all: patient?.treatments?.["$values"] || [],
		available:
			patient?.treatments?.["$values"]?.filter(
				(treatment) => treatment.endedAt == null,
			) || [],
		closed:
			patient?.treatments?.["$values"]?.filter(
				(treatment) => treatment.endedAt != null,
			) || [],
	};

	const isEmpty = treatments.available.length == 0;
	const isTeacher = view == 2;
	const hasAnamnese = !!patient?.anamneses?.["$values"].length;

	return (
		<>
			<Typography color={"#A1A1AA"}>Tratamento Aberto:</Typography>
			<Grid
				container
				justifyContent={{ xs: "center", md: "normal" }}
				mb={2}
				gap={3}
			>
				{hasAnamnese ? (
					isEmpty ? (
						isTeacher ? (
							<ButtonBase
								disabled={!hasAnamnese}
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
										<Typography
											variant="caption"
											color={"error"}
										>
											Não há Tratamentos registrados.
										</Typography>
									</CardContent>
								</Card>
							</ButtonBase>
						) : (
							<ButtonBase
								component={Link}
								href={`./${patient?.id}/tratamento/novo`}
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
											Criar Tratamento
										</Typography>
									</CardContent>
								</Card>
							</ButtonBase>
						)
					) : (
						treatments.available.map((treatment, index) => {
							return (
								<ButtonBase
									key={index}
									component={Link}
									href={`./${patient.id}/tratamento/${treatment.id}`}
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
												{treatment.name}
											</Typography>
										</CardContent>
										<Image
											src={cardDatasheet}
											alt="Imagem Ilustrativa"
										/>
									</Card>
								</ButtonBase>
							);
						})
					)
				) : (
					<ButtonBase
						disabled={!hasAnamnese}
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
								<Typography variant="caption" color={"error"}>
									<>
										<strong>Tratamento</strong>
										<br />É necessário realizar a Anamnese
										antes.
									</>
								</Typography>
							</CardContent>
						</Card>
					</ButtonBase>
				)}
			</Grid>

			{!!treatments?.closed?.length && (
				<>
					<Typography color={"#A1A1AA"}>
						Tratamentos Fechados:
					</Typography>
					<Grid
						container
						justifyContent={{ xs: "center", md: "normal" }}
						mb={2}
						gap={3}
						pb={3}
						style={{ borderBottom: "1px solid #E0E0E0" }}
					>
						{treatments.closed.map((treatment, index) => {
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
											opacity: 0.8,
										}}
									>
										<CardContent>
											<Typography>
												{treatment.name}
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
		</>
	);
};

export default TreatmentListByPatient;
