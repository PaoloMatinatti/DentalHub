"use client";

import React from "react";
import { Grid, Typography, Paper, CardMedia, Alert, Box } from "@mui/material";
import { DentalhubLogo } from "@/components/core/logo";
import dental from "@/services/dental-api";
import { useUser } from "@/providers/user-provider";

import logoUnifenas from "@/assets/client/unifenas-logo-black.png";
import Image from "next/image";

const RelatorioFicha = ({ id }) => {
	const [isLoading, setIsLoading] = React.useState(true);
	const [data, setData] = React.useState(null);
	const { user } = useUser();

	React.useEffect(() => {
		if (!user.id || !user.userType) return;

		const getReport = async () => {
			try {
				const response = await dental.patients.report({
					patientId: id,
					userId: user.id,
					userType: user.userType,
				});

				setData(response);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};

		getReport();
	}, [id, user]);

	if (isLoading)
		return (
			<Grid
				container
				spacing={1}
				alignItems={"center"}
				gap={6}
				sx={{
					maxWidth: 400,
					margin: "80px auto 0",
				}}
			>
				<CardMedia
					sx={{
						maxWidth: "max-content",
						margin: "0 auto",
					}}
				>
					<DentalhubLogo />
				</CardMedia>
				<Alert
					sx={{
						maxWidth: "max-content",
						margin: "0 auto",
					}}
					severity="info"
				>
					Geranto relatório
				</Alert>
			</Grid>
		);

	if (!id || !data)
		return (
			<Grid
				container
				spacing={1}
				alignItems={"center"}
				gap={6}
				sx={{
					maxWidth: 400,
					margin: "80px auto 0",
				}}
			>
				<CardMedia
					sx={{
						maxWidth: "max-content",
						margin: "0 auto",
					}}
				>
					<DentalhubLogo />
				</CardMedia>
				<Alert severity="error">
					Contate o suporte técnico do projeto. Houve algum problema.
				</Alert>
			</Grid>
		);

	return (
		<>
			<Paper
				elevation={0}
				style={{
					width: "860px",
					height: "950px",
					padding: "30px",
					margin: "20px auto",
				}}
			>
				<Grid
					container
					spacing={2}
					flexDirection={"column"}
					alignItems={"center"}
					justifyContent={"center"}
					textAlign={"center"}
					mb={5}
				>
					<Box mb={1}>
						<Image
							width={250}
							src={logoUnifenas}
							alt="Logo Unifenas"
						/>
					</Box>
					CURSO DE ODONTOLOGIA - CLÍNICAS ODONTOLÓGICAS <br />
					<Typography fontSize={12}>
						Relatório Gerado Através Do Dentalhub.
					</Typography>
				</Grid>

				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography
							variant="h6"
							color={"secondary.black"}
							sx={{ fontWeight: "bold" }}
						>
							Informações do Paciente
						</Typography>
					</Grid>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Nome:</strong> {data.name}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Data de Nascimento:</strong>
								{new Date(data.birthDate).toLocaleDateString()}
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Gênero:</strong>
								{["Masculino", "Feminino"][data.gender]}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Grupo Étnico:</strong>
								{
									[
										"Indigena",
										"AfroBrasileiro",
										"Branco",
										"Asiatico",
										"Pardo",
										"Outro",
									][data.ethnicGroup]
								}
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Cartão Regional do SUS:</strong>
								{data.susRegionalCard}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Cartão Nacional do SUS:</strong>
								{data.susNationalCard}
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Dependente:</strong>
								{data.isDependent ? "Sim" : "Não"}
							</Typography>
						</Grid>
					</Grid>
					<hr />
					<Grid item xs={12}>
						<Typography
							variant="h6"
							color={"secondary.black"}
							sx={{ fontWeight: "bold" }}
						>
							Endereço
						</Typography>
					</Grid>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Rua:</strong> {data.address.street}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Bairro:</strong> {data.address.district}
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Cidade:</strong> {data.address.city}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>UF:</strong>{" "}
								{
									[
										"AC",
										"AL",
										"AP",
										"AM",
										"BA",
										"CE",
										"DF",
										"ES",
										"GO",
										"MA",
										"MT",
										"MS",
										"MG",
										"PA",
										"PB",
										"PR",
										"PE",
										"PI",
										"RJ",
										"RN",
										"RS",
										"RO",
										"RR",
										"SC",
										"SP",
										"SE",
										"TO",
									][data.address.uf - 1]
								}
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Número:</strong> {data.address.number}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Telefone:</strong>
								{data.address.telephone}
							</Typography>
						</Grid>
					</Grid>
					<hr />
					{!data.isDependent && (
						<>
							<Grid item xs={12}>
								<Typography
									variant="h6"
									color={"secondary.black"}
									sx={{ fontWeight: "bold" }}
								>
									Endereço Comercial
								</Typography>
							</Grid>
							<Grid item xs={12} container spacing={2}>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>Rua:</strong>{" "}
										{data?.comercialAddress?.street}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>Bairro:</strong>{" "}
										{data?.comercialAddress?.district}
									</Typography>
								</Grid>
							</Grid>
							<Grid item xs={12} container spacing={2}>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>Cidade:</strong>{" "}
										{data?.comercialAddress?.city}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>UF:</strong>{" "}
										{
											[
												"AC",
												"AL",
												"AP",
												"AM",
												"BA",
												"CE",
												"DF",
												"ES",
												"GO",
												"MA",
												"MT",
												"MS",
												"MG",
												"PA",
												"PB",
												"PR",
												"PE",
												"PI",
												"RJ",
												"RN",
												"RS",
												"RO",
												"RR",
												"SC",
												"SP",
												"SE",
												"TO",
											][data?.comercialAddress?.uf - 1]
										}
									</Typography>
								</Grid>
							</Grid>
							<Grid item xs={12} container spacing={2}>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>Número:</strong>{" "}
										{data?.comercialAddress?.number}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>Telefone:</strong>
										{data?.comercialAddress?.telephone}
									</Typography>
								</Grid>
							</Grid>
						</>
					)}
					<hr />
					<Grid item xs={12}>
						<Typography
							variant="h6"
							color={"secondary.black"}
							sx={{ fontWeight: "bold" }}
						>
							Outras Informações
						</Typography>
					</Grid>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Email:</strong>
								{data.email}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Profissão:</strong> {data.occupation}
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Encaminhada por:</strong>{" "}
								{data.recommendation}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Nome do Pai:</strong> {data.fatherName}
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="body1">
								<strong>Nome da Mãe:</strong> {data.motherName}
							</Typography>
						</Grid>
					</Grid>
					<hr />
					{data.isDependent && (
						<>
							<Grid item xs={12}>
								<Typography
									variant="h6"
									color={"secondary.black"}
									sx={{ fontWeight: "bold" }}
								>
									Dados Responsáveis
								</Typography>
							</Grid>
							<Grid item xs={12} container spacing={2}>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>Nome:</strong>{" "}
										{data?.ResponsibleId?.name}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>Telefone:</strong>{" "}
										{data?.ResponsibleId?.phone}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>Rua:</strong>{" "}
										{data?.ResponsibleId?.street}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>Bairro:</strong>{" "}
										{data?.ResponsibleId?.district}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>Número:</strong>{" "}
										{data?.ResponsibleId?.number}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="body1">
										<strong>Cidade:</strong>{" "}
										{data?.ResponsibleId?.city}
									</Typography>
								</Grid>
							</Grid>
						</>
					)}
				</Grid>
			</Paper>

			<Paper
				elevation={0}
				style={{
					width: "860px",
					height: "950px",
					padding: "30px",
					margin: "20px auto",
				}}
			>
				<Grid container spacing={3}>
					<hr
						style={{
							borderBottom: "1px solid #6750a454",
							width: "94%",
							marginTop: "25px",
						}}
					/>
					<Grid item xs={12}>
						<Typography
							variant="h6"
							color="secondary.black"
							sx={{ fontWeight: "bold" }}
						>
							Relatório Anamnese -{" "}
							{data?.anamneses.$values[0]?.index}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>Queixa Principal</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>História da Doença Atual</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Doenças da Infância
							</strong>
						</Typography>
						<Typography variant="body1">Caxumba</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Distúrbios
								Cardiovasculares
							</strong>
						</Typography>
						<Typography variant="body1">Febre reumática</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>Queixa Principal</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>História da Doença Atual</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Doenças da Infância
							</strong>
						</Typography>
						<Typography variant="body1">Caxumba</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Distúrbios
								Cardiovasculares
							</strong>
						</Typography>
						<Typography variant="body1">Febre reumática</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>Queixa Principal</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>História da Doença Atual</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
						</Typography>
					</Grid>
				</Grid>
			</Paper>

			<Paper
				elevation={0}
				style={{
					width: "860px",
					height: "950px",
					padding: "30px",
					margin: "20px auto",
				}}
			>
				<Grid container spacing={3}>
					<hr
						style={{
							borderBottom: "1px solid #6750a454",
							width: "94%",
							marginTop: "25px",
						}}
					/>
					<Grid item xs={12}>
						<Typography
							variant="h6"
							color="secondary.black"
							sx={{ fontWeight: "bold" }}
						>
							ATM - {data?.atms.$values[0]?.index}
						</Typography>
					</Grid>

					<Grid item xs={12} container spacing={2}>
						<Grid item xs={5}>
							<Typography variant="body1">
								<strong>Aluno Responsável:</strong> Gabriel
								Neves
							</Typography>
						</Grid>
						<Grid item xs={5}>
							<Typography variant="body1">
								<strong>Aluno Responsável:</strong> Gabriel
								Neves
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>Queixa Principal</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>História da Doença Atual</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Doenças da Infância
							</strong>
						</Typography>
						<Typography variant="body1">Caxumba</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Distúrbios
								Cardiovasculares
							</strong>
						</Typography>
						<Typography variant="body1">Febre reumática</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>Queixa Principal</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>História da Doença Atual</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Doenças da Infância
							</strong>
						</Typography>
						<Typography variant="body1">Caxumba</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Distúrbios
								Cardiovasculares
							</strong>
						</Typography>
						<Typography variant="body1">Febre reumática</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>Queixa Principal</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>História da Doença Atual</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
						</Typography>
					</Grid>
				</Grid>
			</Paper>

			<Paper
				elevation={0}
				style={{
					width: "860px",
					height: "950px",
					padding: "30px",
					margin: "20px auto",
				}}
			>
				<Grid container spacing={3}>
					<hr
						style={{
							borderBottom: "1px solid #6750a454",
							width: "94%",
							marginTop: "25px",
						}}
					/>
					<Grid item xs={12}>
						<Typography
							variant="h6"
							color="secondary.black"
							sx={{ fontWeight: "bold" }}
						>
							Relatório Tratamentos - Triagem -{" "}
							{data?.treatments.$values[0]?.name}
						</Typography>
					</Grid>

					<Grid item xs={12} container spacing={2}>
						<Grid item xs={5}>
							<Typography variant="body1">
								<strong>Aluno Responsável:</strong> Gabriel
								Neves
							</Typography>
						</Grid>
						<Grid item xs={5}>
							<Typography variant="body1">
								<strong>Aluno Responsável:</strong> Gabriel
								Neves
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>Queixa Principal</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>História da Doença Atual</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Doenças da Infância
							</strong>
						</Typography>
						<Typography variant="body1">Caxumba</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Distúrbios
								Cardiovasculares
							</strong>
						</Typography>
						<Typography variant="body1">Febre reumática</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>Queixa Principal</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>História da Doença Atual</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Doenças da Infância
							</strong>
						</Typography>
						<Typography variant="body1">Caxumba</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							•
							<strong>
								Você já teve ou já tem: Distúrbios
								Cardiovasculares
							</strong>
						</Typography>
						<Typography variant="body1">Febre reumática</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>Queixa Principal</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							• <strong>História da Doença Atual</strong>
						</Typography>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
						</Typography>
					</Grid>
				</Grid>
			</Paper>

			<Paper
				elevation={0}
				style={{
					width: "860px",
					height: "950px",
					padding: "30px",
					margin: "20px auto",
				}}
			>
				<Grid container spacing={3}>
					<hr
						style={{
							borderBottom: "1px solid #6750a454",
							width: "94%",
							marginTop: "25px",
						}}
					/>
					<Grid item xs={12}>
						<Typography
							variant="h6"
							color="secondary.black"
							sx={{ fontWeight: "bold" }}
						>
							Relatório Tratamentos - Plano Cronológico -{" "}
							{data?.treatments.$values[0]?.name}
						</Typography>
					</Grid>

					<Grid item xs={12} container spacing={2}>
						<Grid item xs={5}>
							<Typography variant="body1">
								<strong>Aluno Responsável:</strong> Gabriel
								Neves
							</Typography>
						</Grid>
						<Grid item xs={5}>
							<Typography variant="body1">
								<strong>Aluno Responsável:</strong> Gabriel
								Neves
							</Typography>
						</Grid>
					</Grid>

					<Grid item xs={11} margin={"0 auto"}>
						<Typography variant="body1">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vel libero eros. Nulla auctor lobortis
							odio quis aliquam. Aliquam ullamcorper nunc eu sem
							ornare, sed pretium risus molestie. Pellentesque est
							lectus, mattis in elementum ut, accumsan quis eros.
							Phasellus gravida efficitur orci nec fermentum.
							Aenean vitae est in neque luctus varius. Vestibulum
							vitae odio quis lectus semper gravida id a est.
							Proin vitae euismod sapien. In hac habitasse platea
							dictumst. Aenean in mollis massa. Fusce aliquet
							cursus condimentum. Etiam semper eros ac sapien
							fringilla, sed finibus ex dapibus. In suscipit
							imperdiet felis. Nunc fringilla ullamcorper porta.
							Cras interdum augue et dignissim cursus. Etiam
							dictum dui sed ipsum vehicula feugiat. Donec sed
							felis pharetra, pretium sem a, iaculis justo. Duis
							non odio odio. Nullam suscipit, purus in faucibus
							dapibus, arcu diam rhoncus nunc, at luctus arcu
							libero malesuada nisi. Sed tempor venenatis ante, id
							efficitur justo semper in. Etiam tristique ultricies
							leo eget posuere. Sed nec dui nec odio luctus
							convallis. Nulla sed eleifend nunc, sed lobortis
							dui. Orci varius natoque penatibus et magnis dis
							parturient montes, nascetur ridiculus mus. Nullam in
							consequat augue. Phasellus vitae lectus iaculis,
							aliquam dui quis, posuere sapien. Sed rhoncus
							sollicitudin arcu ac mattis. Maecenas rhoncus erat
							non massa vehicula, at condimentum magna ultrices.
							Mauris pharetra ut augue in finibus. Nunc a arcu
							turpis. Quisque tincidunt mi congue, dictum ipsum a,
							efficitur arcu. Ut ante orci, gravida a finibus eu,
							tempor at nisi. Nulla sit amet nunc a elit tempor
							condimentum. Aenean porttitor, erat in semper
							tincidunt, purus sapien vulputate orci, non
							sollicitudin arcu massa vitae arcu. Pellentesque
							posuere, nibh et dictum ultricies, neque mauris
							eleifend nunc, ut porttitor risus lectus ut libero.
						</Typography>
					</Grid>
				</Grid>
			</Paper>

			<Paper
				elevation={0}
				style={{
					width: "860px",
					height: "950px",
					padding: "30px",
					margin: "20px auto",
				}}
			>
				<Grid container spacing={3}>
					<hr
						style={{
							borderBottom: "1px solid #6750a454",
							width: "94%",
							marginTop: "25px",
						}}
					/>
					<Grid item xs={12}>
						<Typography
							variant="h6"
							color="secondary.black"
							sx={{ fontWeight: "bold" }}
						>
							Relatório Tratamentos - Plano Cronológico -{" "}
							{data?.treatments.$values[0]?.name}
						</Typography>
					</Grid>

					<Grid item xs={11} margin={"0 auto"}>
						<Image
							width={700}
							height={400}
							src="/desenho-da-dor.png"
							alt="mapa"
						></Image>
					</Grid>
				</Grid>
			</Paper>

			<Paper
				elevation={0}
				style={{
					width: "860px",
					height: "950px",
					padding: "30px",
					margin: "20px auto",
				}}
			>
				<Grid container spacing={3}>
					<hr
						style={{
							borderBottom: "1px solid #6750a454",
							width: "94%",
							marginTop: "25px",
						}}
					/>
					<Grid item xs={12}>
						<Typography
							variant="h6"
							color="secondary.black"
							sx={{ fontWeight: "bold" }}
						>
							Relatório Tratamentos - Plano Cronológico -{" "}
							{data?.treatments.$values[0]?.name}
						</Typography>
					</Grid>
					<Grid item xs={11} margin={"0 auto"}>
						<Image
							width={700}
							height={700}
							src="/mapa-periodontal.png"
							alt="mapa"
						></Image>
					</Grid>
				</Grid>
			</Paper>
		</>
	);
};

export default RelatorioFicha;
