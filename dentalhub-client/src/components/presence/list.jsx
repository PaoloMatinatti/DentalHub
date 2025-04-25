"use client";

import React from "react";

import {
	Box,
	Button,
	Divider,
	FormControl,
	Grid,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	MenuItem,
	Select,
	Typography,
} from "@mui/material";
import dental from "@/services/dental-api";
import Link from "next/link";
import routes from "@/app/routes";
import { Refresh } from "@mui/icons-material";
import { useFrontdesk } from "@/providers/frontdesk-provider";
import { toast } from "sonner";

const PresenceList = ({ view }) => {
	const { currentClinicState, presenceListState } = useFrontdesk();

	const substituteCurrentClinicState = React.useState(null);
	const substitutePresenceList = React.useState([]);

	const [isLoading, setIsLoading] = React.useState(false);
	const [selectedClincIndex, setSelectedClinicIndex] = React.useState(0);
	const [clinicList, setClinicList] = React.useState([]);
	const [presenceList, setPresenceList] =
		presenceListState || substitutePresenceList;

	const selectedClinic = clinicList[selectedClincIndex];
	const setCurrentClinic =
		currentClinicState?.[1] || substituteCurrentClinicState[1];

	const getClinicList = React.useCallback(async () => {
		try {
			setIsLoading(true);
			const clinicListResponse = await dental.clinics.get();

			if (!clinicListResponse[0]?.id) return;

			setClinicList(clinicListResponse);

			const clinicPresencesResponse = await dental.presences.getByClinic(
				clinicListResponse[0]?.id,
			);

			setPresenceList(clinicPresencesResponse);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [setPresenceList]);

	const getPresences = React.useCallback(async () => {
		if (!selectedClinic?.id) return;

		try {
			setIsLoading(true);

			const clinicPresencesResponse = await dental.presences.getByClinic(
				selectedClinic?.id,
			);

			setPresenceList(clinicPresencesResponse);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [setPresenceList, selectedClinic]);

	React.useEffect(() => {
		if (selectedClinic) setCurrentClinic(selectedClinic);

		getPresences();
	}, [selectedClinic, setCurrentClinic, getPresences]);

	React.useEffect(() => {
		getClinicList();
	}, [getClinicList]);

	const handleUnbookPresence = async (id) => {
		try {
			await dental.presences.unbook(id);
			await getClinicList();
			toast.success("Paciente removido a lista de presença.");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Box>
			<FormControl
				variant="standard"
				sx={{
					m: 1,
				}}
			>
				<Select
					name="clinic"
					label="Clínica"
					defaultValue={selectedClincIndex}
					onChange={(e) => setSelectedClinicIndex(e.target.value)}
				>
					{clinicList.map((clinic, index) => {
						return (
							<MenuItem value={index} key={index}>
								{clinic?.name}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>

			<Grid
				sx={{
					m: 0,
					minWidth: 120,
					display: "flex",
					mb: 1,
					gap: 1,
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<Typography variant="h6">Lista de Presença</Typography>
				{view == 4 && (
					<Button
						variant="text"
						aria-label="Atualizar lista"
						onClick={getPresences}
						sx={{
							gap: 1,
						}}
					>
						<Refresh />
						Atualizar
					</Button>
				)}
			</Grid>

			<List>
				{!presenceList.length ? (
					<>
						<ListItem>
							<ListItemText
								primary={
									"Não há pacientes na lista de presença."
								}
							/>
						</ListItem>
					</>
				) : (
					presenceList.map((presence) => {
						return (
							<React.Fragment key={presence?.id}>
								<ListItem>
									<ListItemText
										primary={presence?.patient?.name}
										secondary={`Desde: ${new Date(
											presence.createdAt,
										).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}`}
									/>

									{view == 4 ? (
										<ListItemButton
											disabled={isLoading}
											LinkComponent={Link}
											href={
												routes.panels.student.patient
													.details.path +
												"/" +
												presence?.patient?.id
											}
											sx={{
												maxWidth: "max-content",
												marginLeft: "auto",
											}}
										>
											<Typography variant="body2">
												Ver detalhes
											</Typography>
										</ListItemButton>
									) : (
										<ListItemButton
											disabled={isLoading}
											onClick={() =>
												handleUnbookPresence(
													presence?.id,
												)
											}
											sx={{
												maxWidth: "max-content",
												marginLeft: "auto",
											}}
										>
											<Typography variant="body2">
												Remover
											</Typography>
										</ListItemButton>
									)}
								</ListItem>

								<Divider />
							</React.Fragment>
						);
					})
				)}
			</List>
		</Box>
	);
};

export default PresenceList;
