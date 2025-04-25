import React from "react";
import {
	Modal,
	Button,
	Card,
	CardContent,
	CardHeader,
	TextField,
	Grid,
} from "@mui/material";
import StudentSelection from "@/components/students/search";

const ModalCriarTratamento = ({ state }) => {
	const [open, setOpen] = state;

	const handleClose = () => {
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
						maxWidth: "700px",
						width: "100%",
						margin: "auto",
						mt: 9,
						mb: 9,
					}}
				>
					<CardHeader
						title={"Criar tratamento"}
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
						<Grid gap={4}>
							<TextField
								InputLabelProps={{
									shrink: undefined,
								}}
								name="name"
								label="Nome do Tratamento"
								sx={{ width: "400px" }}
								variant="outlined"
								required={true}
								inputProps={{
									maxLength: 50,
								}}
							/>
							<StudentSelection view={4} />
							<StudentSelection view={4} />
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
								onClick={handleClose}
								variant="contained"
								color="primary"
								sx={{
									width: "262px",
								}}
							>
								Confirmar
							</Button>
						</div>
					</CardContent>
				</Card>
			</Modal>
		</div>
	);
};

export default ModalCriarTratamento;
