import React from "react";
import {
	Modal,
	Typography,
	Button,
	Card,
	CardContent,
	CardHeader,
	Grid,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const ModalResponsavel = ({ state, list, callback }) => {
	const [open, setOpen] = state;

	const handleClose = () => {
		callback(list[list.length - 1]);
		setOpen(false);
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
						maxWidth: "350px",
						width: "100%",
						margin: "auto",
						mt: 9,
						mb: 9,
					}}
				>
					<CardHeader
						title={"Boas-vindas"}
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
						<Typography color={"#A1A1AA"}>
							Selecione a ficha que deseja visualizar
						</Typography>
						<Grid
							container
							justifyContent={"center"}
							gap={3}
							pb={3}
						>
							<List sx={{ width: "100%" }}>
								{list.map((patient, index) => {
									return (
										<React.Fragment key={index}>
											<ListItem
												disablePadding
												sx={{ width: "100%" }}
											>
												<ListItemButton
													onClick={() =>
														callback(patient)
													}
												>
													<PersonIcon />
													<ListItemText
														inset
														primary={patient.name}
													/>
												</ListItemButton>
											</ListItem>
											<Divider />
										</React.Fragment>
									);
								})}
							</List>
						</Grid>
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
		</div>
	);
};

export default ModalResponsavel;
