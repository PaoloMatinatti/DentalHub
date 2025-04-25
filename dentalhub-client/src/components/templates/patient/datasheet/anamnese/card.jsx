"use client";

import { ButtonBase, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Link from "next/link";

const AnamneseCard = ({ patient, view = 4 }) => {
	const anamneses = {
		all: patient?.anamneses?.["$values"] || [],
		available:
			patient?.anamneses?.["$values"]?.filter(
				(anamnese) => anamnese.endedAt == null,
			) || [],
	};

	const isEmpty = anamneses.all.length == 0;
	const isTeacher = view == 2;

	return (
		<>
			{isEmpty ? (
				isTeacher ? (
					<ButtonBase
						disabled={true}
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
									Não há Anamneses registradas.
								</Typography>
							</CardContent>
						</Card>
					</ButtonBase>
				) : (
					<ButtonBase
						component={Link}
						href={`./${patient?.id}/anamnese/novo`}
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
								<Typography>Criar Anamnese</Typography>
							</CardContent>
						</Card>
					</ButtonBase>
				)
			) : (
				anamneses.available.map((anamnese, index) => {
					return (
						<ButtonBase
							key={index}
							component={Link}
							href={`./${patient.id}/anamnese/${anamnese.id}`}
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
									<Typography>Anamnese</Typography>
									<Typography
										variant="body2"
										color={"primary"}
									>
										de {anamnese.index}
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
			)}
		</>
	);
};

export default AnamneseCard;
