"use client";

import React from "react";

import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Container,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import { DentalhubLogo } from "@/components/core/logo";
import Image from "next/image";
import logoUnifenas from "@/assets/client/unifenas-logo.png";
import dental from "@/services/dental-api";
import { useRouter } from "next/navigation";

import { protectedRoutes } from "@/app/routes";
import { useUser } from "@/providers/user-provider";

const TemplateAccess = ({ loginLabel, userType }) => {
	const { handleUpdateUser } = useUser();

	const [submitStates, setSubmitStates] = React.useState({
		loading: false,
		error: "",
	});

	const handleLoading = (loading) =>
		setSubmitStates((values) => ({
			...values,
			loading,
		}));

	const handleError = (error) =>
		setSubmitStates((values) => ({
			...values,
			error,
		}));

	const router = useRouter();

	const handleSubmit = async (event) => {
		event.preventDefault();
		handleLoading(true);
		handleError("");

		const data = new FormData(event.target);

		const formData = {
			username: data.get("username"),
			password: data.get("password"),
			type: userType,
		};

		try {
			const response = await dental.user.auth(formData);

			router.push(protectedRoutes[formData.type - 1]);

			handleUpdateUser(response);
		} catch (error) {
			console.error(error);

			if (typeof error == "string") {
				handleError(error);
			}

			handleLoading(false);
		}
	};

	return (
		<Container>
			<Grid justifyContent="center">
				<Card
					variant="outlined"
					sx={{
						minHeight: "100dvh",
						width: "100%",
						maxWidth: 427,
						border: "none",
						display: "flex",
						justifyContent: "space-between",
						flexDirection: "column",
						margin: "auto",
					}}
				>
					<CardMedia
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 12,
							mt: 8,
						}}
					>
						<DentalhubLogo />
					</CardMedia>

					<CardContent>
						<CardHeader
							title="Boas vindas!"
							sx={{ textAlign: "center" }}
						/>
						<Typography textAlign={"center"}>
							Digite seus dados e acesse a sua conta.
						</Typography>
						<Grid
							item
							xs={12}
							component={"form"}
							autoComplete="off"
							onSubmit={handleSubmit}
						>
							<Typography
								variant="body2"
								color={"#ff0000"}
								sx={{
									marginTop: "32px",
									marginBottom: "12px",
								}}
							>
								{submitStates.error}
							</Typography>
							<TextField
								label={loginLabel}
								sx={{ width: "100%" }}
								disabled={submitStates.loading}
								aria-disabled={submitStates.loading}
								name="username"
							/>
							<TextField
								type="password"
								label="Senha"
								name="password"
								sx={{
									width: "100%",
									marginTop: "12px",
									marginBottom: "32px",
								}}
								disabled={submitStates.loading}
								aria-disabled={submitStates.loading}
							/>
							<CardActions sx={{ padding: 0 }}>
								<Button
									type="submit"
									variant="contained"
									sx={{
										width: "100%",
									}}
									disabled={submitStates.loading}
									aria-disabled={submitStates.loading}
								>
									Acessar conta
								</Button>
							</CardActions>
						</Grid>
					</CardContent>
					<Grid
						container
						alignItems={"center"}
						flexDirection={"row"}
						width={"100%"}
						justifyContent={"space-around"}
						flexWrap={"nowrap"}
						mb={4}
					>
						<Box>
							<Image src={logoUnifenas} alt="Logo Unifenas" />
						</Box>
						<Typography variant="body2" color={"GrayText"}>
							Todos os direitos reservados © Dentalhub
						</Typography>
					</Grid>
				</Card>
			</Grid>
		</Container>
	);
};

export default TemplateAccess;
