"use client";

import {
	Button,
	Card,
	CardMedia,
	Grid,
	Typography,
	colors,
	Box,
	Stack,
} from "@mui/material";
import styles from "./style.module.css";
import { DentalhubLogo } from "@/components/core/logo";
import routes from "../routes";
import Link from "next/link";

import patientAvatar from "@/assets/avatars/avatar-patient.svg";
import teacherAvatar from "@/assets/avatars/avatar-teacher.svg";
import frontdeskAvatar from "@/assets/avatars/avatar-frontdesk.svg";
import studentAvatar from "@/assets/avatars/avatar-student.svg";
import Image from "next/image";

export default function Home() {
	return (
		<>
			<main className={styles.main}>
				<CardMedia>
					<DentalhubLogo />
				</CardMedia>

				<Typography
					variant="body1"
					color={colors.grey[700]}
					sx={{
						mt: 7,
					}}
				>
					Identifique-se:
				</Typography>

				<Grid
					item
					xs={12}
					md={6}
					sx={{ width: "100%", maxWidth: 600, mt: 3 }}
				>
					<Stack
						direction="column"
						justifyContent="center"
						alignItems="flex-start"
						spacing={2}
						useFlexGap
						sx={{
							width: "100%",
							display: {
								sm: "flex",
							},
						}}
					>
						<Card
							variant="outlined"
							component={Button}
							sx={{
								p: 3,
								height: "fit-content",
								width: "100%",
								background: "none",
							}}
						>
							<Box
								sx={{
									width: "100%",
									display: "flex",
									textAlign: "left",
									flexDirection: {
										xs: "column",
										md: "row",
									},
									alignItems: { md: "center" },
									gap: 2.5,
								}}
							>
								<Box>
									<Image src={patientAvatar} alt="Ícone" />
								</Box>
								<Box sx={{ textTransform: "none" }}>
									<Typography
										color="text.primary"
										variant="body2"
										fontWeight="bold"
									>
										Paciente
									</Typography>
									<Typography
										color="text.secondary"
										variant="body2"
										sx={{ my: 0.5 }}
									>
										Veja seus detalhes
									</Typography>
									<Link
										color="#fff"
										variant="body2"
										fontWeight="bold"
										href={routes.access.patient.path}
										sx={{
											display: "inline-flex",
											alignItems: "center",
											"& > svg": {
												transition: "0.2s",
											},
											"&:hover > svg": {
												transform: "translateX(2px)",
											},
										}}
										onClick={(event) => {
											event.stopPropagation();
										}}
									>
										<span>Acessar</span>
									</Link>
								</Box>
							</Box>
						</Card>
						<Card
							variant="outlined"
							component={Button}
							sx={{
								p: 3,
								height: "fit-content",
								width: "100%",
								background: "none",
							}}
						>
							<Box
								sx={{
									width: "100%",
									display: "flex",
									textAlign: "left",
									flexDirection: {
										xs: "column",
										md: "row",
									},
									alignItems: { md: "center" },
									gap: 2.5,
								}}
							>
								<Box>
									<Image src={frontdeskAvatar} alt="Ícone" />
								</Box>
								<Box sx={{ textTransform: "none" }}>
									<Typography
										color="text.primary"
										variant="body2"
										fontWeight="bold"
									>
										Recepção
									</Typography>
									<Typography
										color="text.secondary"
										variant="body2"
										sx={{ my: 0.5 }}
									>
										Veja seus detalhes
									</Typography>
									<Link
										color="primary"
										variant="body2"
										fontWeight="bold"
										href={routes.access.frontdesk.path}
										sx={{
											display: "inline-flex",
											alignItems: "center",
											"& > svg": {
												transition: "0.2s",
											},
											"&:hover > svg": {
												transform: "translateX(2px)",
											},
										}}
									>
										<span>Acessar</span>
									</Link>
								</Box>
							</Box>
						</Card>
						<Card
							variant="outlined"
							component={Button}
							sx={{
								p: 3,
								height: "fit-content",
								width: "100%",
								background: "none",
							}}
						>
							<Box
								sx={{
									width: "100%",
									display: "flex",
									textAlign: "left",
									flexDirection: {
										xs: "column",
										md: "row",
									},
									alignItems: { md: "center" },
									gap: 2.5,
								}}
							>
								<Box>
									<Image src={studentAvatar} alt="Ícone" />
								</Box>
								<Box sx={{ textTransform: "none" }}>
									<Typography
										color="text.primary"
										variant="body2"
										fontWeight="bold"
									>
										Aluno
									</Typography>
									<Typography
										color="text.secondary"
										variant="body2"
										sx={{ my: 0.5 }}
									>
										Veja seus detalhes
									</Typography>
									<Link
										color="primary"
										variant="body2"
										fontWeight="bold"
										href={routes.access.student.path}
										sx={{
											display: "inline-flex",
											alignItems: "center",
											"& > svg": {
												transition: "0.2s",
											},
											"&:hover > svg": {
												transform: "translateX(2px)",
											},
										}}
										onClick={(event) => {
											event.stopPropagation();
										}}
									>
										<span>Acessar</span>
									</Link>
								</Box>
							</Box>
						</Card>
						<Card
							variant="outlined"
							component={Button}
							sx={{
								p: 3,
								height: "fit-content",
								width: "100%",
								background: "none",
							}}
						>
							<Box
								sx={{
									width: "100%",
									display: "flex",
									textAlign: "left",
									flexDirection: {
										xs: "column",
										md: "row",
									},
									alignItems: { md: "center" },
									gap: 2.5,
								}}
							>
								<Box>
									<Image src={teacherAvatar} alt="Ícone" />
								</Box>
								<Box sx={{ textTransform: "none" }}>
									<Typography
										color="text.primary"
										variant="body2"
										fontWeight="bold"
									>
										Professor
									</Typography>
									<Typography
										color="text.secondary"
										variant="body2"
										sx={{ my: 0.5 }}
									>
										Veja seus detalhes
									</Typography>
									<Link
										color="primary"
										variant="body2"
										fontWeight="bold"
										href={routes.access.teacher.path}
										sx={{
											display: "inline-flex",
											alignItems: "center",
											"& > svg": {
												transition: "0.2s",
											},
											"&:hover > svg": {
												transform: "translateX(2px)",
											},
										}}
										onClick={(event) => {
											event.stopPropagation();
										}}
									>
										<span>Acessar</span>
									</Link>
								</Box>
							</Box>
						</Card>
					</Stack>
				</Grid>
			</main>
		</>
	);
}
