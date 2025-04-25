import { formatCPF } from "@/utils/text";
import dental from "@/services/dental-api";
import { getRandomColor } from "@/utils/colors";
import React, { useState, useEffect } from "react";
import {
	Modal,
	Button,
	Card,
	CardContent,
	CardHeader,
	Grid,
	Avatar,
	Typography,
	TextField,
	Autocomplete,
	Box,
} from "@mui/material";
import { toast } from "sonner";

const ModalParaValidacao = ({
	state,
	list,
	data,
	setIsValidating,
	targetName = "anamnese",
}) => {
	const answersList = list;
	const [teacherList, setTeacherList] = useState([]);
	const [selectedTeacherId, setSelectedTeacherId] = useState(-1);
	const [teacherColors, setTeacherColors] = useState({});

	useEffect(() => {
		const getTeacherList = async () => {
			try {
				const response = await dental.affiliated.getTeachers();
				setTeacherList(response);
			} catch (error) {
				console.error(error);
			}
		};

		getTeacherList();
	}, []);

	const handleTeacherChange = (event, value) => {
		if (value) {
			const teacherId = value.id;
			if (!teacherColors[teacherId]) {
				setTeacherColors((prevColors) => ({
					...prevColors,
					[teacherId]: getRandomColor(),
				}));
			}
			setSelectedTeacherId(teacherId);
		} else {
			setSelectedTeacherId(null);
		}
	};

	const selectedTeacher = teacherList[selectedTeacherId];
	const [open, setOpen] = state;

	const handleClose = () => {
		setOpen(false);
		setSelectedTeacherId(-1);
	};

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
			>
				<Card
					sx={{
						maxWidth: "700px",
						width: "100%",
						margin: "auto",
						mt: 9,
						mb: 9,
					}}
				>
					<CardHeader
						title={"Enviar Prontuário para Validação"}
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
						<Grid
							container
							justifyContent={"center"}
							gap={3}
							pb={3}
						>
							<Box>
								<Autocomplete
									disablePortal
									id="teachers-box"
									options={teacherList.map(
										(teacher, index) => ({
											label: `${teacher.name} (${teacher.cpf ? formatCPF(teacher.cpf) : teacher.token})`,
											id: index,
										}),
									)}
									onReset={() => setSelectedTeacherId(null)}
									autoHighlight
									onChange={handleTeacherChange}
									sx={{ width: 400, mt: 2 }}
									noOptionsText={
										<Typography textAlign={"center"}>
											Nenhum professor foi encontrado.
										</Typography>
									}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Pesquisar Professor"
										/>
									)}
								/>

								<Typography
									sx={{
										fontSize: 12,
										ml: 1,
										mt: 1,
										width: 400,
									}}
								>
									Pesquise na lista de professores através do
									Nome ou Matrícula.
								</Typography>

								{selectedTeacher ? (
									<Card
										variant="outlined"
										sx={{ width: 400, marginTop: 4 }}
									>
										<CardHeader
											avatar={
												<Avatar
													sx={{
														bgcolor:
															teacherColors[
																selectedTeacherId
															],
													}}
													aria-label="recipe"
													key={
														selectedTeacher.name[0]
													}
												>
													{selectedTeacher.name[0]}
												</Avatar>
											}
											title={selectedTeacher.name}
											subheader={`Matrícula: ${selectedTeacher.registry}`}
										/>
									</Card>
								) : null}
							</Box>
						</Grid>
						<div
							style={{
								display: "flex",
								gap: "2rem",
								flexWrap: "wrap",
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
							<Button
								onClick={async () => {
									try {
										await dental.form[
											targetName
										].setValidation({
											[`${targetName}Id`]:
												data[`${targetName}Id`],
											studentId: data.studentId,
											teacherId: selectedTeacher.id,
											answersList,
										});

										setIsValidating(true);
										handleClose();
										toast.success(
											"Validação enviada com sucesso.",
										);
									} catch (error) {
										console.error(error);
									}
								}}
								variant="contained"
								color="primary"
								disabled={!selectedTeacher?.id}
								sx={{
									width: "262px",
								}}
							>
								Enviar
							</Button>
						</div>
					</CardContent>
				</Card>
			</Modal>
		</div>
	);
};

export default ModalParaValidacao;
