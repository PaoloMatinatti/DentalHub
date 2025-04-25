import React from "react";
import {
	Modal,
	Button,
	Card,
	CardContent,
	CardHeader,
	List,
	ListItem,
	ListItemText,
	Typography,
	Divider,
	ListSubheader,
} from "@mui/material";

const ModalHistorico = ({ state }) => {
	const [open, setOpen] = state;

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
		>
			<Card
				sx={{
					maxWidth: "850px",
					width: "100%",
					margin: "auto",
					mt: 9,
					mb: 9,
				}}
			>
				<CardHeader
					title={"Historico de Atividades"}
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
					<div
						style={{
							display: "flex",
							gap: "2rem",
							flexWrap: "wrap",
							justifyContent: "center",
							width: "100%",
						}}
					>
						<div>
							<List
								sx={{
									width: "100%",
									minWidth: 360,
								}}
								subheader={
									<ListSubheader>Alunos</ListSubheader>
								}
							>
								<ListItem alignItems="center">
									<ListItemText
										primary="Gabriel Neves"
										secondary={
											<React.Fragment>
												<Typography
													sx={{
														display: "inline",
													}}
													variant="body2"
													color="text.primary"
												>
													10/06/2024
												</Typography>
											</React.Fragment>
										}
									/>
									<Button
										variant="outlined"
										color="clinicBlue"
										target="_blank"
										sx={{ height: "100%" }}
									>
										Ver
									</Button>
								</ListItem>
								<Divider />
								<ListItem alignItems="center">
									<ListItemText
										primary="Gabriel Neves"
										secondary={
											<React.Fragment>
												<Typography
													sx={{
														display: "inline",
													}}
													variant="body2"
													color="text.primary"
												>
													10/06/2024
												</Typography>
											</React.Fragment>
										}
									/>
									<Button
										variant="outlined"
										color="clinicBlue"
										target="_blank"
										sx={{ height: "100%" }}
									>
										Ver
									</Button>
								</ListItem>
								<Divider />
								<ListItem alignItems="center">
									<ListItemText
										primary="Gabriel Neves"
										secondary={
											<React.Fragment>
												<Typography
													sx={{
														display: "inline",
													}}
													variant="body2"
													color="text.primary"
												>
													10/06/2024
												</Typography>
											</React.Fragment>
										}
									/>
									<Button
										variant="outlined"
										color="clinicBlue"
										target="_blank"
										sx={{ height: "100%" }}
									>
										Ver
									</Button>
								</ListItem>
							</List>
						</div>
						<div>
							<List
								sx={{
									width: "100%",
									minWidth: 360,
								}}
								subheader={
									<ListSubheader>Professores</ListSubheader>
								}
							>
								<ListItem alignItems="center">
									<ListItemText
										primary="Everaldo Junior"
										secondary={
											<React.Fragment>
												<Typography
													sx={{
														display: "inline",
													}}
													variant="body2"
													color="text.primary"
												>
													10/06/2024
												</Typography>
											</React.Fragment>
										}
									/>
								</ListItem>
								<Divider />
								<ListItem alignItems="center">
									<ListItemText
										primary="Everaldo Junior"
										secondary={
											<React.Fragment>
												<Typography
													sx={{
														display: "inline",
													}}
													variant="body2"
													color="text.primary"
												>
													10/06/2024
												</Typography>
											</React.Fragment>
										}
									/>
								</ListItem>
								<Divider />
								<ListItem alignItems="center">
									<ListItemText
										primary="Everaldo Junior"
										secondary={
											<React.Fragment>
												<Typography
													sx={{
														display: "inline",
													}}
													variant="body2"
													color="text.primary"
												>
													10/06/2024
												</Typography>
											</React.Fragment>
										}
									/>
								</ListItem>
							</List>
						</div>
					</div>
					<Button
						onClick={handleClose}
						variant="outlined"
						color="neutral"
						sx={{
							width: "262px",
							marginTop: "16px",
						}}
					>
						Voltar
					</Button>
				</CardContent>
			</Card>
		</Modal>
	);
};

export default ModalHistorico;
