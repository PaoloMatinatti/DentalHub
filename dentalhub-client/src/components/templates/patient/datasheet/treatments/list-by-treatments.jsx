"use client";

import { ButtonBase, Card, CardContent, Grid, Typography } from "@mui/material";
import Image from "next/image";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Link from "next/link";

const TreatmentListByTreatment = ({ list }) => {
	const treatments = {
		all: list || [],
		available: list?.filter((treatment) => treatment.endedAt == null) || [],
		closed: list?.filter((treatment) => treatment.endedAt != null) || [],
	};

	const isEmpty = treatments.available.length == 0;

	return (
		<>
			<Typography color={"#A1A1AA"}>Tratamento Aberto:</Typography>
			<Grid
				container
				justifyContent={{ xs: "center", md: "normal" }}
				mb={2}
				gap={3}
			>
				{isEmpty ? (
					<Typography>Não há tratamentos para listar.</Typography>
				) : (
					treatments.available.map((treatment, index) => {
						return (
							<ButtonBase
								key={index}
								component={Link}
								href={`../paciente/${treatment?.patient?.id}/tratamento/${treatment?.id}`}
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
										<Typography
											color={"primary"}
											variant={"body2"}
										>
											Paciente: {treatment?.patient?.name}
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

export default TreatmentListByTreatment;
