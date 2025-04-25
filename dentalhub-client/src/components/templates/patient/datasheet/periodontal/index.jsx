"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { fabric } from "fabric";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	Grid,
	Typography,
	Slider,
	FormControl,
	Select,
	MenuItem,
	Box,
	Chip,
	ButtonBase,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { blobToFile, dataURLToBlob } from "@/utils/file";
import dental from "@/services/dental-api";
import { useUser } from "@/providers/user-provider";
import { toast } from "sonner";
import { usePatient } from "@/providers/patient-provider";
import { handleStatusColor, handleStatusMessage } from "@/utils/text";
import { Visibility } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import cardDatasheet from "@/assets/client/card-datasheet.jpg";
import ModalValidacao from "../../modal-validation";
import ModalValidateChart from "./modal-validate";

const emptyImg = "/mapa-periodontal.png";

async function fetchImageWithHeaders(url, headers) {
	const response = await fetch(url, {
		headers: {
			...headers,
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch image: ${response.status} ${response.statusText}`,
		);
	}

	const blob = await response.blob();
	return blob;
}

const PeriodontalCanvas = ({ view = 4, data }) => {
	const isTeacher = view == 2;
	const { user } = useUser();

	const canvasRef = useRef(null);
	const [canvas, setCanvas] = useState(null);
	const [brushWidth, setBrushWidth] = useState(5);
	const [brushColor, setBrushColor] = useState("red");
	const [isValidating, setIsValidating] = React.useState(false);
	const [history, setHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const router = useRouter();
	const modalState = React.useState(false);
	const [isModalOpen, setIsModalOpen] = modalState;

	const { patient, handleUpdatePatient } = usePatient();
	const [isLoaded, setIsLoaded] = useState(false);

	React.useEffect(() => {
		if (patient?.id) return;

		const getPatientData = async () => {
			if ((!data && false) || (!data && !user?.id)) return;

			try {
				const response = await dental.form.periodontal.getByPatient(
					data || user?.id,
				);

				return handleUpdatePatient({
					...response,
				});
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoaded(true);
			}
		};

		getPatientData();
	}, [user, data, patient?.id, handleUpdatePatient]);

	const periodontalCharts = React.useMemo(() => {
		const allCharts = patient?.periodontalCharts || [];
		const activeChart =
			allCharts.find((chart) => chart.endedAt === null) || null;
		const oldCharts = allCharts.filter((chart) => chart.endedAt !== null);

		return {
			all: allCharts,
			active: activeChart,
			old: oldCharts.reverse(),
		};
	}, [patient]);

	const imageSrc = periodontalCharts?.active?.url || emptyImg;

	const isApproved =
		periodontalCharts?.active?.status == "Aprovado" ||
		periodontalCharts?.active?.status == "Observacoes";

	const updateCanvasSize = useCallback(async () => {
		if (canvas && canvas.lowerCanvasEl) {
			const containerWidth = canvas.lowerCanvasEl.clientWidth;
			const containerHeight = canvas.lowerCanvasEl.clientHeight;

			fetchImageWithHeaders(imageSrc, {
				"ngrok-skip-browser-warning": "any-value",
			})
				.then((blob) => {
					const reader = new FileReader();

					reader.onload = function () {
						const dataUrl = reader.result;

						fabric.Image.fromURL(
							dataUrl,
							(img) => {
								img.crossOrigin = "anonymous";
								const imageAspectRatio = img.width / img.height;
								const containerAspectRatio =
									containerWidth / containerHeight;

								let scaleFactor;
								if (containerAspectRatio > imageAspectRatio) {
									scaleFactor = containerHeight / img.height;
								} else {
									scaleFactor = containerWidth / img.width;
								}

								const scaledWidth = img.width * scaleFactor;
								const scaledHeight = img.height * scaleFactor;

								canvas.setWidth(1200);
								canvas.setHeight(1200);

								img.scaleToWidth(scaledWidth);
								img.scaleToHeight(scaledHeight);

								canvas.setBackgroundImage(
									img,
									canvas.renderAll.bind(canvas),
									{
										scaleX: 1,
										scaleY: 1,
									},
								);
								canvas.renderAll();
							},
							null,
							{ crossOrigin: "anonymous" },
						);
					};

					reader.readAsDataURL(blob);
				})
				.catch((error) => {
					console.error("Error fetching image:", error);
				});
		}
	}, [canvas, imageSrc]);

	useEffect(() => {
		if (canvasRef.current) {
			const initCanvas = new fabric.Canvas(canvasRef.current);
			setCanvas(initCanvas);

			return () => {
				initCanvas.dispose();
				setCanvas(null);
			};
		}
	}, []);

	useEffect(() => {
		if (canvas && imageSrc) {
			updateCanvasSize();

			const brush = new fabric.PencilBrush(canvas);
			brush.color = brushColor;
			brush.width = brushWidth;
			brush.globalAlpha = 0.8;

			canvas.freeDrawingBrush = brush;
			canvas.isDrawingMode = true;

			const handleResize = () => {
				updateCanvasSize();
			};

			window.addEventListener("resize", handleResize);

			return () => {
				window.removeEventListener("resize", handleResize);
			};
		}
	}, [canvas, imageSrc, updateCanvasSize, brushWidth, brushColor]);

	const saveCanvas = async () => {
		if (canvas && data && user) {
			if (isValidating)
				return toast.warning("Esse Mapa está em validação.");

			try {
				const dataURL = canvas.toDataURL({
					format: "png",
					quality: 1,
				});

				const blob = dataURLToBlob(dataURL);

				const file = blobToFile(
					blob,
					`mapa-periodontal-${new Date()
						.toISOString()
						.replace(/[:.]/g, "-")}.png`,
				);

				if (!user?.id) return;

				const formData = new FormData();

				formData.append("file", file);
				formData.append("patientId", data);
				formData.append("studentId", user.id);

				await dental.form.periodontal.create(formData);

				toast.success("Novo mapa salvo com sucesso.");

				const response = await dental.form.periodontal.getByPatient(
					data || user?.id,
				);

				return handleUpdatePatient({
					...response,
				});
			} catch (error) {
				toast.error(
					"Algo deu errado, tente limpar a tela e desenhar novamente.",
				);
				console.error(error);
			}
		}
	};

	const handleBrushWidthChange = (event, newValue) => {
		setBrushWidth(newValue);
		if (canvas) {
			canvas.freeDrawingBrush.width = newValue;
		}
	};

	const handleBrushColorChange = (event) => {
		const color = event.target.value;
		setBrushColor(color);
		if (canvas) {
			canvas.freeDrawingBrush.color = color;
		}
	};

	const handleClearCanvas = () => {
		if (canvas) {
			if (isValidating)
				return toast.warning("Esse Mapa está em validação.");

			canvas.clear();
			reloadBackgroundImage();
			setHistory([]);
			setHistoryIndex(-1);
		}
	};

	const reloadBackgroundImage = () => {
		if (canvas) {
			fabric.Image.fromURL(emptyImg, (img) => {
				const containerWidth = canvas.getWidth();
				const containerHeight = canvas.getHeight();

				const imageAspectRatio = img.width / img.height;
				const containerAspectRatio = containerWidth / containerHeight;

				let scaleFactor;
				if (containerAspectRatio > imageAspectRatio) {
					scaleFactor = containerHeight / img.height;
				} else {
					scaleFactor = containerWidth / img.width;
				}

				const scaledWidth = img.width * scaleFactor;
				const scaledHeight = img.height * scaleFactor;

				img.scaleToWidth(scaledWidth);
				img.scaleToHeight(scaledHeight);

				canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
					scaleX: 1,
					scaleY: 1,
				});
				canvas.renderAll();
			});
		}
	};

	const saveToHistory = useCallback(() => {
		if (canvas) {
			const json = canvas.toJSON();
			const historyCopy = history.slice(0, historyIndex + 1);
			historyCopy.push(json);
			setHistory(historyCopy);
			setHistoryIndex(historyCopy.length - 1);
		}
	}, [canvas, history, historyIndex]);

	useEffect(() => {
		if (canvas) {
			canvas.on("object:added", saveToHistory);
			canvas.on("object:removed", saveToHistory);
			canvas.on("object:modified", saveToHistory);
		}
	}, [canvas, saveToHistory]);

	React.useEffect(() => {
		setIsValidating(periodontalCharts?.active?.status == "Validando");
	}, [periodontalCharts]);

	if (
		(data && !patient?.id && isLoaded) ||
		(data && patient?.id && !patient.hasAnamnese && isLoaded)
	) {
		toast.error("Algo deu errado.");
		return router.back();
	}

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
				title={"Mapa Periodontal"}
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
				<div
					style={{
						position: "relative",
						width: "100%",
						height: "100%",
						overflow: "hidden",
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
						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								flexDirection: "column",
							}}
						>
							<Typography>Desenho o Mapa Periodontal</Typography>
							{periodontalCharts.active && (
								<Typography variant="body2" color={"#A1A1AA"}>
									Última Edição Por:{" "}
									{periodontalCharts?.active?.lastEditName}
								</Typography>
							)}
						</div>

						<div>
							{periodontalCharts.all.length == 0 ? (
								<Chip
									label="Novo Plano"
									variant="outlined"
									color="primary"
								/>
							) : isValidating ? (
								<Chip
									label={handleStatusMessage("Validando")}
									variant="filled"
									color={handleStatusColor("Validando")}
								/>
							) : (
								<Chip
									label={handleStatusMessage(
										periodontalCharts.active.status,
									)}
									variant="filled"
									color={handleStatusColor(
										periodontalCharts.active.status,
									)}
								/>
							)}
						</div>
					</Grid>

					{periodontalCharts.active?.feedback && (
						<Card variant="outlined" mb={10}>
							<CardContent>
								<Typography
									variant="h6"
									marginBottom={2}
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}
								>
									<Visibility /> Observação:
								</Typography>

								<Typography>
									{periodontalCharts?.active?.feedback}
								</Typography>
							</CardContent>
						</Card>
					)}

					<div
						style={{
							pointerEvents:
								isValidating || isTeacher ? "none" : "all",
							opacity: isValidating || isTeacher ? ".7" : "1",
						}}
					>
						{!isTeacher && (
							<Grid
								container
								justifyContent="space-between"
								alignItems="center"
							>
								<Grid item xs={6} sm={3}>
									<Typography variant="body1">
										Tamanho do Pincel:
									</Typography>
									<Slider
										value={brushWidth}
										min={1}
										max={20}
										step={1}
										onChange={handleBrushWidthChange}
										sx={{ width: "100%", marginTop: "8px" }}
									/>
								</Grid>
								<Grid item xs={6} sm={3}>
									<Typography variant="body1">
										Cor do Pincel:
									</Typography>
									<FormControl
										sx={{ width: "100%", marginTop: "8px" }}
									>
										<Select
											value={brushColor}
											onChange={handleBrushColorChange}
										>
											<MenuItem value="red">
												Vermelho
											</MenuItem>
											<MenuItem value="blue">
												Azul
											</MenuItem>
											<MenuItem value="green">
												Verde
											</MenuItem>
											<MenuItem value="black">
												Preto
											</MenuItem>
										</Select>
									</FormControl>
								</Grid>
							</Grid>
						)}

						<canvas
							ref={canvasRef}
							style={{
								position: "absolute",
								top: "0",
								left: "0",
								width: "100%",
								height: "100%",
								marginTop: "2rem",
							}}
						/>
					</div>
				</div>

				{!isTeacher && (
					<Box
						display="flex"
						alignItems="center"
						mt={1}
						mb={4}
						justifyContent={"space-between"}
					>
						{periodontalCharts.active && !isTeacher && (
							<Typography
								variant="body2"
								flex={1}
								color={"#A1A1AA"}
							>
								Se você salvar, será gerado um novo Mapa. O
								anterior ainda estará disponível para
								visualização caso tenha sido aprovado.
							</Typography>
						)}
						<div>
							<Button
								onClick={handleClearCanvas}
								variant="contained"
								color="error"
								sx={{ width: "262px", marginRight: "16px" }}
							>
								Limpar
							</Button>
							<Button
								onClick={saveCanvas}
								variant="contained"
								sx={{ width: "262px" }}
							>
								Salvar Desenho
							</Button>
						</div>
					</Box>
				)}
				{!!periodontalCharts.old.length && (
					<>
						<Typography color={"#A1A1AA"}>
							Planos Anteriores:
						</Typography>
						<Grid
							container
							justifyContent={{ xs: "center", md: "normal" }}
							mb={2}
							gap={3}
							pb={3}
							style={{ borderBottom: "1px solid #E0E0E0" }}
						>
							{periodontalCharts.old.map((plan, index) => {
								const isApproved =
									plan.status == "Aprovado" ||
									plan.status == "Observacoes";

								return (
									<ButtonBase
										key={index}
										LinkComponent={Link}
										target="_blank"
										href={isApproved ? plan.url : ""}
										style={{
											textAlign: "left",
											maxWidth: "100%",
											pointerEvents: isApproved
												? "all"
												: "none",
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
													{new Date(
														plan.createdAt,
													).toLocaleDateString()}
												</Typography>
												<Typography
													color={handleStatusColor(
														plan.status,
													)}
													variant="body2"
												>
													{handleStatusMessage(
														plan.status,
													)}
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

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Button
						LinkComponent={Link}
						href="./"
						variant="text"
						color="neutral"
						sx={{
							width: "262px",
						}}
					>
						Voltar
					</Button>

					{periodontalCharts.active &&
						(isTeacher ? (
							<Button
								onClick={() => {
									if (!isValidating)
										return toast.warning(
											"Não está disponível para validação.",
										);

									setIsModalOpen(true);
								}}
								variant="outlined"
								sx={{
									width: "262px",
								}}
							>
								Validar
							</Button>
						) : (
							<Button
								onClick={() => {
									if (isValidating || isApproved)
										return toast.warning(
											"Já está em validação.",
										);

									setIsModalOpen(true);
								}}
								variant="outlined"
								sx={{
									width: "262px",
								}}
							>
								Enviar para validação
							</Button>
						))}
				</div>
			</CardContent>

			{isModalOpen && isTeacher && periodontalCharts.active && (
				<ModalValidacao
					data={{
						treatmentId: periodontalCharts.active.id,
						validationId:
							periodontalCharts.active?.currentValidationId,
					}}
					targetName="periodontal"
					state={modalState}
				/>
			)}

			{isModalOpen && !isTeacher && (
				<ModalValidateChart
					data={{
						chartId: periodontalCharts?.active?.id,
						studentId: user?.id,
					}}
					setIsValidating={setIsValidating}
					state={modalState}
				/>
			)}
		</Card>
	);
};

export default PeriodontalCanvas;
