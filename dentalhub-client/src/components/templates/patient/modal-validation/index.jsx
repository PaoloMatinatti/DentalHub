import React from "react";
import {
	Modal,
	Button,
	Card,
	CardContent,
	CardHeader,
	Input,
} from "@mui/material";
import { toast } from "sonner";
import dental from "@/services/dental-api";

const ModalValidacao = ({
	state,
	data: { treatmentId, validationId },
	targetName = "anamnese",
}) => {
	const [open, setOpen] = state;

	const [feedbackContent, setFeedbackContent] = React.useState("");

	const handleClose = () => {
		setOpen(false);
		setFeedbackContent("");
	};

	const handleValidate = async (status) => {
		if (!treatmentId || !validationId || !status) {
			return toast.error("Algo de errado aconteceu.");
		}

		try {
			await dental.form[`${targetName}`].validate({
				status,
				[`${targetName}Id`]: treatmentId,
				validationId,
				feedback: feedbackContent,
			});

			toast.success("Validação enviada com sucesso.");
			return window.location.reload();
		} catch (error) {
			console.error(error);
		}
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
						title={"Validação do Prontuário"}
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
						<Input
							multiline
							minRows={8}
							value={feedbackContent}
							onChange={(e) => setFeedbackContent(e.target.value)}
							placeholder="Digite aqui alguma observação (Opcional)"
							sx={{ width: "100%", minHeight: "200px" }}
						></Input>

						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								gap: "2rem",
								flexWrap: "wrap",
								width: "100%",
							}}
						>
							<Button
								onClick={handleClose}
								variant="outlined"
								color="info"
								sx={{
									maxWidth: "262px",
									marginRight: "auto",
								}}
							>
								Cancelar
							</Button>
							<Button
								onClick={() => handleValidate(4)}
								variant="outlined"
								color="error"
								sx={{
									maxWidth: "262px",
								}}
							>
								Reprovar
							</Button>
							<Button
								onClick={() =>
									handleValidate(
										feedbackContent == "" ? 3 : 5,
									)
								}
								variant="contained"
								color="primary"
								sx={{
									maxWidth: "262px",
								}}
							>
								Aprovar
							</Button>
						</div>
					</CardContent>
				</Card>
			</Modal>
		</div>
	);
};

export default ModalValidacao;
