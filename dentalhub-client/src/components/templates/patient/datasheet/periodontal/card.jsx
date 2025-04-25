"use client";

import { ButtonBase, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Link from "next/link";

const PeriodontalCard = ({ patient, view = 4 }) => {
	const periodontals = {
		all: patient?.periodontalCharts?.["$values"] || [],
		available:
			patient?.periodontalCharts?.["$values"]?.filter(
				(treatment) => treatment.endedAt == null,
			) || [],
		closed:
			patient?.periodontalCharts?.["$values"]?.filter(
				(treatment) => treatment.endedAt != null,
			) || [],
	};

	const isEmpty = periodontals.all.length == 0;
	const isTeacher = view == 2;
	const hasAnamnese = !!patient?.anamneses?.["$values"].length;

	return (
		<>
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
										Não há nenhum mapa periodontal
										registrado.
									</Typography>
								</CardContent>
							</Card>
						</ButtonBase>
					) : (
						<ButtonBase
							component={Link}
							href={`./${patient?.id}/mapa/`}
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
										Mapas Periodontais (opcional)
									</Typography>
								</CardContent>
							</Card>
						</ButtonBase>
					)
				) : (
					periodontals.available.map((periodontalChart, index) => {
						return (
							<ButtonBase
								key={index}
								component={Link}
								href={`./${patient.id}/mapa/`}
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
											Mapa Periodontal
										</Typography>
										<Typography
											variant="body2"
											color={"primary"}
										>
											de{" "}
											{new Date(
												periodontalChart.createdAt,
											).toLocaleDateString()}
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
								<strong>Mapa Periodontal</strong>
								<br />É necessário realizar a Anamnese antes.
							</Typography>
						</CardContent>
					</Card>
				</ButtonBase>
			)}
		</>
	);
};

export default PeriodontalCard;
