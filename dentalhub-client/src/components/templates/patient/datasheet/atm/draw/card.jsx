"use client";

import { ButtonBase, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Link from "next/link";

const DrawCard = ({ atm, view = 4 }) => {
	const draws = {
		all: atm?.painDraws || [],
		available:
			atm?.painDraws?.filter((treatment) => treatment.endedAt == null) ||
			[],
		closed:
			atm?.painDraws?.filter((treatment) => treatment.endedAt != null) ||
			[],
	};

	const isEmpty = draws.all.length == 0;
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
									Não há nenhum desenho da dor registrado.
								</Typography>
							</CardContent>
						</Card>
					</ButtonBase>
				) : (
					<ButtonBase
						component={Link}
						href={`./${atm?.id}/desenho/`}
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
									Desenho da Dor (opcional)
								</Typography>
							</CardContent>
						</Card>
					</ButtonBase>
				)
			) : (
				draws.available.map((periodontalChart, index) => {
					return (
						<ButtonBase
							key={index}
							component={Link}
							href={`./${atm?.id}/desenho/`}
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
									<Typography>Desenho da Dor</Typography>
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
			)}
		</>
	);
};

export default DrawCard;
