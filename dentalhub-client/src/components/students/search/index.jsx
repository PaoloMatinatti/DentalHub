"use client";

import React, { useState, useEffect } from "react";
import dental from "@/services/dental-api";
import {
	Autocomplete,
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardHeader,
	TextField,
	Typography,
} from "@mui/material";
import { useUser } from "@/providers/user-provider";
import { getRandomColor } from "@/utils/colors";
import Link from "next/link";

const StudentSelection = ({ view }) => {
	const { handleBookPresence, isUserLoading } = useUser();
	const [studentList, setStudentList] = useState([]);
	const [selectedStudentId, setSelectedStudentId] = useState(null);
	const [patientColors, setPatientColors] = useState({});

	useEffect(() => {
		const getStudentList = async () => {
			try {
				const response = await dental.affiliated.getStudents();
				setStudentList(response);
			} catch (error) {
				console.error(error);
			}
		};

		getStudentList();
	}, []);

	const handleStudentChange = (event, value) => {
		if (value) {
			const patientId = value.id;
			if (!patientColors[patientId]) {
				setPatientColors((prevColors) => ({
					...prevColors,
					[patientId]: getRandomColor(),
				}));
			}
			setSelectedStudentId(patientId);
		} else {
			setSelectedStudentId(null);
		}
	};

	const selectedStudent = studentList[selectedStudentId];

	return (
		<Box>
			{view != 4 && (
				<Typography variant="body1" mt={1}>
					Lista de alunos.
				</Typography>
			)}

			<Autocomplete
				disablePortal
				id="patients-box"
				options={studentList.map((student, index) => ({
					label: `${student.name} (${student.registry})`,
					id: index,
				}))}
				onReset={() => setSelectedStudentId(null)}
				autoHighlight
				onChange={handleStudentChange}
				sx={{ width: 400, mt: 2 }}
				noOptionsText={
					<Typography textAlign={"center"}>
						Nenhum aluno foi encontrado.
					</Typography>
				}
				renderInput={(params) => (
					<TextField {...params} label="Pesquisar Aluno" />
				)}
			/>

			<Typography sx={{ fontSize: 12, ml: 1, mt: 1, width: 400 }}>
				Pesquise na lista de alunos através do Nome ou Matrícula.
			</Typography>

			{selectedStudent && view != 4 ? (
				<Card variant="outlined" sx={{ width: 400, marginTop: 4 }}>
					<CardHeader
						avatar={
							<Avatar
								sx={{
									bgcolor: patientColors[selectedStudentId],
								}}
								aria-label="recipe"
								key={selectedStudent.name[0]}
							>
								{selectedStudent.name[0]}
							</Avatar>
						}
						title={selectedStudent.name}
						subheader={`Matrícula: ${selectedStudent.registry}`}
					/>

					<CardActions>
						<Button
							LinkComponent={Link}
							href={"painel/aluno/" + selectedStudent.id}
							disabled={isUserLoading}
							size="small"
						>
							Ver Detalhes
						</Button>

						{view != 2 && (
							<Button
								onClick={() =>
									handleBookPresence(selectedStudent.id)
								}
								disabled={isUserLoading}
								size="small"
							>
								Marcar Presença
							</Button>
						)}
					</CardActions>
				</Card>
			) : null}
		</Box>
	);
};

export default StudentSelection;
