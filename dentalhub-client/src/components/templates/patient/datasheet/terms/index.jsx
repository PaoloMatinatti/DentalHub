"use client";

import React, { useState, useRef } from "react";
import {
	Button,
	ButtonBase,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Modal,
	Typography,
} from "@mui/material";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import Image from "next/image";
import dental from "@/services/dental-api";
import { useRouter } from "next/navigation";
import { checkIsPediatric } from "@/utils/date";
import { useUser } from "@/providers/user-provider";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styled from "@emotion/styled";
import Link from "next/link";
import { toast } from "sonner";
import { protectedRoutes } from "@/app/routes";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const validateFile = (file) => {
	if (file.size > MAX_FILE_SIZE) {
		return "Aquivo excedeu o limite de 2MB.";
	}

	if (
		!(
			file.type === "application/pdf" ||
			file.type === "image/png" ||
			file.type === "image/jpeg"
		)
	) {
		return "Tipo inválido de arquivo.";
	}

	return null;
};

const termsType = [
	{
		name: "Procedimentos",
		blank: "/termo-procedimentos.pdf",
	},
	{
		name: "Tratamento",
		blank: "/termo-tratamento.pdf",
	},
	{
		name: "Divulgacao",
		blank: "/termo-divulgacao.pdf",
	},
	{
		name: "Pediatria",
		blank: "/termo-pediatrico.pdf",
	},
];

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

const Termos = ({ data, view }) => {
	const router = useRouter();
	const isPatient = view == 1;

	const handleUpdatePatient = (data) => {
		setPatient((value) => ({
			...value,
			...data,
		}));
	};

	const [isLoaded, setIsLoaded] = useState(false);
	const [patient, setPatient] = useState(null);
	const [attachedFile, setAttachedFile] = useState(null);

	const [modalData, setModalData] = useState({
		isOpen: false,
		modalType: -1,
	});

	const fileInputRef = useRef(null);

	const handleFileUploadClick = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setAttachedFile(file);
		}
	};

	const { user } = useUser();

	React.useEffect(() => {
		const getPatientData = async () => {
			if ((!data && !isPatient) || (!data && !user?.id)) return;

			try {
				const response = await dental.patients.getById(
					data || user?.id,
				);

				setPatient({
					...response,
					isPediatric: !checkIsPediatric(
						new Date(response.birthDate),
					),
				});
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoaded(true);
			}
		};

		getPatientData();
	}, [data, view, user, isPatient]);

	const currentModalTerm = termsType[modalData.modalType];
	const currentTermList =
		patient?.terms?.["$values"]?.filter(
			(term) => term?.type == modalData.modalType,
		) || [];

	const handleOpen = (modalType) => {
		setModalData({
			isOpen: true,
			modalType,
		});
	};
	const handleClose = () =>
		setModalData({
			isOpen: false,
			modalType: -1,
		});

	if (data && !patient && isLoaded) {
		return router.back();
	}

	return (
		<>
			<Modal
				open={modalData.isOpen}
				onClose={handleClose}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
			>
				<Card
					sx={{
						maxWidth: "100%",
						width: "550px",
						margin: "auto",
						mt: 9,
						mb: 9,
					}}
				>
					<CardHeader
						title={`Autorização para ${currentModalTerm?.name}`}
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
							justifyContent: "center",
							alignItems: "center",
							gap: "16px",
						}}
					>
						<Grid container>
							<List sx={{ width: "100%" }}>
								<ListItem disablePadding>
									<ListItemButton
										LinkComponent={Link}
										target="_blank"
										href={currentModalTerm?.blank || ""}
										sx={{
											"&:hover .download-icon": {
												opacity: 1,
											},
										}}
									>
										<ListItemText primary="Termo em Branco" />
										<DownloadIcon
											className="download-icon"
											sx={{ opacity: 0.5 }}
										/>
									</ListItemButton>
								</ListItem>
								<Divider />

								<form
									onSubmit={async (e) => {
										e.preventDefault();

										const formData = new FormData(
											event.target,
										);

										const fileValidation = validateFile(
											formData.get("file"),
										);

										if (fileValidation) {
											return toast.error(fileValidation);
										}

										formData.append(
											"type",
											modalData?.modalType,
										);

										formData.append(
											"patientId",
											patient?.id,
										);

										try {
											const response =
												await dental.terms.upload(
													formData,
												);

											toast.success(
												"Arquivo adicionado com sucesso.",
											);

											handleUpdatePatient({
												terms: {
													$values: [
														...(patient?.terms?.[
															"$values"
														] || undefined),
														response,
													],
												},
											});

											setAttachedFile(null);
										} catch (error) {
											console.error(error);
										}
									}}
								>
									<ListItem disablePadding>
										<ListItemButton
											sx={{
												"&:hover .upload-icon": {
													opacity: 1,
												},
											}}
											onClick={handleFileUploadClick}
										>
											<ListItemText
												primary={
													attachedFile
														? attachedFile.name
																.length > 30
															? `${attachedFile.name.substring(0, 30)}...`
															: attachedFile.name
														: "Anexar arquivo"
												}
											/>
											<VisuallyHiddenInput
												type="file"
												name="file"
												ref={fileInputRef}
												onChange={handleFileChange}
											/>
											<UploadFileIcon
												className="upload-icon"
												sx={{ opacity: 0.5 }}
											/>
										</ListItemButton>
										{attachedFile && (
											<Button type="submit">
												Enviar Arquivo
											</Button>
										)}
									</ListItem>
								</form>
								<Divider />
							</List>
						</Grid>
						{!!currentTermList.length && (
							<Grid container gap={1} pb={3} pt={1}>
								<Typography>
									Selecione o termo que deseja visualizar:
								</Typography>
								<List sx={{ width: "100%" }}>
									{currentTermList?.map((item, index) => {
										return (
											<React.Fragment key={index}>
												<ListItem disablePadding>
													<ListItemButton
														LinkComponent={Link}
														target="_blank"
														href={item.url || "/"}
														sx={{
															"&:hover .visibility-icon":
																{
																	opacity: 1,
																},
														}}
													>
														<ListItemText
															primary={item.name}
														/>
														<VisibilityIcon
															className="visibility-icon"
															sx={{
																opacity: 0.5,
															}}
														/>
													</ListItemButton>
												</ListItem>
												<Divider />
											</React.Fragment>
										);
									})}
								</List>
							</Grid>
						)}
						<div
							style={{
								display: "flex",
							}}
						>
							<Button
								onClick={handleClose}
								variant="outlined"
								color="neutral"
								sx={{
									width: "262px",
								}}
							>
								Voltar
							</Button>
						</div>
					</CardContent>
				</Card>
			</Modal>

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
					title={"Autorizações do Paciente"}
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
						container
						justifyContent={{ xs: "center", md: "space-between" }}
					>
						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								flexDirection: "column",
							}}
						>
							<Typography color={"#A1A1AA"}>Termos</Typography>
						</div>
					</Grid>
					<Grid
						container
						justifyContent={{ xs: "center", md: "normal" }}
						style={{ borderBottom: "1px solid #E0E0E0" }}
						mb={2}
						gap={3}
						pb={3}
					>
						{termsType.map(({ name }, index) => {
							return (
								<ButtonBase
									key={index}
									onClick={() => handleOpen(index)}
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
												Autorização para {name}
											</Typography>
											<Typography
												color="neutral.main"
												variant="body2"
											>
												Visualizar
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
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<Button
							LinkComponent={Link}
							href={`${protectedRoutes[user.userType - 1]}/paciente/${patient?.id}`}
							variant="outlined"
							color="neutral"
							sx={{
								width: "262px",
							}}
						>
							Voltar
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default Termos;
