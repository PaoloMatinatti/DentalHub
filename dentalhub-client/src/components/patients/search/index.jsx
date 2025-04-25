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
import { formatCPF } from "@/utils/text";
import { getRandomColor } from "@/utils/colors";
import routes from "@/app/routes";
import Link from "next/link";

const PatientSelection = ({ view }) => {
	const { isUserLoading } = useUser();

	const [patientList, setPatientList] = useState([]);
	const [selectedPatientId, setSelectedPatientId] = useState(null);
	const [patientColors, setPatientColors] = useState({});

	useEffect(() => {
		const getPatientList = async () => {
			try {
				const response = await dental.patients.get();
				setPatientList(response);
			} catch (error) {
				console.error(error);
			}
		};

		getPatientList();
	}, []);

	const handlePatientChange = (event, value) => {
		if (value) {
			const patientId = value.id;
			if (!patientColors[patientId]) {
				setPatientColors((prevColors) => ({
					...prevColors,
					[patientId]: getRandomColor(),
				}));
			}
			setSelectedPatientId(patientId);
		} else {
			setSelectedPatientId(null);
		}
	};

	const selectedPatient = patientList[selectedPatientId];

	return (
		<Box>
			{view === 3 ? (
				<>
					<Typography variant="h6">Boas vindas</Typography>
					<Typography variant="body1" mt={1}>
						Selecione um paciente para marcar presença na clínica.
					</Typography>
				</>
			) : (
				<Typography variant="body1" mt={1}>
					Lista de paciente.
				</Typography>
			)}

			<Autocomplete
				disablePortal
				id="patients-box"
				options={patientList.map((patient, index) => ({
					label: `${patient.name} (${patient.cpf ? formatCPF(patient.cpf) : patient.token})`,
					id: index,
				}))}
				onReset={() => setSelectedPatientId(null)}
				autoHighlight
				onChange={handlePatientChange}
				sx={{ width: 400, mt: 2 }}
				noOptionsText={
					<>
						<Typography textAlign={"center"} mb={2} mt={1}>
							Nenhum paciente foi encontrado.
						</Typography>
						<Button
							variant="contained"
							href={routes.panels.frontdesk.patient.register.path}
							sx={{
								width: "100%",
							}}
						>
							Novo Paciente
						</Button>
					</>
				}
				renderInput={(params) => (
					<TextField {...params} label="Pesquisar Paciente" />
				)}
			/>

			<Typography sx={{ fontSize: 12, ml: 1, mt: 1, width: 400 }}>
				Pesquise na lista de pacientes através do Nome, CPF ou
				Prontuário.
			</Typography>

			{selectedPatient ? (
				<Card variant="outlined" sx={{ width: 400, marginTop: 4 }}>
					<CardHeader
						avatar={
							<Avatar
								sx={{
									bgcolor: patientColors[selectedPatientId],
								}}
								aria-label="recipe"
								key={selectedPatient.name[0]}
							>
								{selectedPatient.name[0]}
							</Avatar>
						}
						title={selectedPatient.name}
						subheader={`${selectedPatient.cpf ? selectedPatient.cpf : "Paciente Pediátrico"} / Nº ${selectedPatient.token}`}
					/>

					<CardActions>
						<Button
							LinkComponent={Link}
							href={"painel/paciente/" + selectedPatient.id}
							disabled={isUserLoading}
							size="small"
						>
							Ver Detalhes
						</Button>
					</CardActions>
				</Card>
			) : null}
		</Box>
	);
};

export default PatientSelection;
