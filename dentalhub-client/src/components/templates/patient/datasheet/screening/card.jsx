"use client";

import { ButtonBase, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Link from "next/link";

const ScreeningCard = ({ patient, view = 4 }) => {
	const screenings = {
		all: patient?.screenings?.["$values"] || [],
		available:
			patient?.screenings?.["$values"]?.filter(
				(screening) => screening.endedAt == null,
			) || [],
	};

	const isEmpty = screenings.all.length == 0;
	const isTeacher = view == 2;
	const hasAnamnese = !!patient?.anamneses?.["$values"].length;

	console.log(patient);

	return (
		<>
			{hasAnamnese ? (
				isEmpty ? (
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
									<Typography
										variant="caption"
										color={"error"}
									>
										Não há Triagens registradas.
									</Typography>
								</CardContent>
							</Card>
						</ButtonBase>
					) : (
						<ButtonBase
							component={Link}
							href={`./${patient?.id}/triagem/novo`}
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
									<Typography>Criar Triagem</Typography>
								</CardContent>
							</Card>
						</ButtonBase>
					)
				) : (
					screenings.available.map((screening, index) => {
						return (
							<ButtonBase
								key={index}
								component={Link}
								href={`./${patient.id}/triagem/${screening.id}`}
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
										<Typography>Triagem</Typography>
										<Typography
											variant="body2"
											color={"primary"}
										>
											de {screening.index}
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
								<strong>Triagem</strong>
								<br />É necessário realizar a Anamnese antes.
							</Typography>
						</CardContent>
					</Card>
				</ButtonBase>
			)}
		</>
	);
};

export default ScreeningCard;
