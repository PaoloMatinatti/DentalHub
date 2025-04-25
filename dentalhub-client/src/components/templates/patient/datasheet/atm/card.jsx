"use client";

import { ButtonBase, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Link from "next/link";

const AtmCard = ({ patient, view = 4 }) => {
	const atms = {
		all: patient?.atms?.["$values"] || [],
		available:
			patient?.atms?.["$values"]?.filter(
				(treatment) => treatment.endedAt == null,
			) || [],
		closed:
			patient?.atms?.["$values"]?.filter(
				(treatment) => treatment.endedAt != null,
			) || [],
	};

	const isEmpty = atms.all.length == 0;
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
										Não há ATMs registrados.
									</Typography>
								</CardContent>
							</Card>
						</ButtonBase>
					) : (
						<ButtonBase
							component={Link}
							href={`./${patient?.id}/atm/novo`}
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
										Criar ATM (opcional)
									</Typography>
								</CardContent>
							</Card>
						</ButtonBase>
					)
				) : (
					atms.available.map((atm, index) => {
						return (
							<ButtonBase
								key={index}
								component={Link}
								href={`./${patient.id}/atm/${atm.id}`}
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
										<Typography>ATM</Typography>
										<Typography
											variant="body2"
											color={"primary"}
										>
											de {atm.index}
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
								<strong>ATM</strong>
								<br />É necessário realizar a Anamnese antes.
							</Typography>
						</CardContent>
					</Card>
				</ButtonBase>
			)}
		</>
	);
};

export default AtmCard;
