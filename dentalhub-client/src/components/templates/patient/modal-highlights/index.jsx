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
	Chip,
} from "@mui/material";

const ModalAlertas = ({ state }) => {
	const [open, setOpen] = state;

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Chip
				onClick={handleOpen}
				label="2 Alertas"
				variant="contained"
				color="error"
			/>
			<div>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-title"
					aria-describedby="modal-description"
				>
					<Card
						sx={{
							maxWidth: "450px",
							width: "100%",
							margin: "auto",
							mt: 9,
							mb: 9,
						}}
					>
						<CardHeader
							title={"Alertas da Ficha do Paciente"}
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
								<List
									sx={{
										width: "100%",
										minWidth: 360,
									}}
								>
									<ListItem alignItems="center">
										<ListItemText
											primary="Anamnese"
											secondary={
												<React.Fragment>
													<ul>
														<li>
															<Typography
																color="error"
																variant="body2"
															>
																Doença Pulmonar
																Obstrutiva
																Crônica
															</Typography>
														</li>
														<li>
															<Typography
																color="error"
																variant="body2"
															>
																Asma
															</Typography>
														</li>
														<li>
															<Typography
																color="error"
																variant="body2"
															>
																Hipertensão
																Arterial
															</Typography>
														</li>
													</ul>
												</React.Fragment>
											}
										/>
									</ListItem>
									<Divider />
									<ListItem alignItems="center">
										<ListItemText
											primary="Triagem"
											secondary={
												<React.Fragment>
													<ul>
														<li>
															<Typography
																color="error"
																variant="body2"
															>
																Artrite
																Reumatoide
															</Typography>
														</li>
														<li>
															<Typography
																color="error"
																variant="body2"
															>
																Acidente
																Vascular
																Cerebral
															</Typography>
														</li>
													</ul>
												</React.Fragment>
											}
										/>
									</ListItem>
									<Divider />
									<ListItem alignItems="center">
										<ListItemText
											primary="ATM"
											secondary={
												<React.Fragment>
													<ul>
														<li>
															<Typography
																color="error"
																variant="body2"
															>
																Infarto Agudo do
																Miocárdio
															</Typography>
														</li>
													</ul>
												</React.Fragment>
											}
										/>
									</ListItem>
								</List>
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
			</div>
		</>
	);
};

export default ModalAlertas;
