"use client";

import Image from "next/image";
import logoUnifenas from "@/assets/client/unifenas-logo.png";

import { DentalhubLogo } from "@/components/core/logo";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useUser } from "@/providers/user-provider";

import patientAvatar from "@/assets/avatars/avatar-patient.svg";
import teacherAvatar from "@/assets/avatars/avatar-teacher.svg";
import frontdeskAvatar from "@/assets/avatars/avatar-frontdesk.svg";
import studentAvatar from "@/assets/avatars/avatar-student.svg";
import adminAvatar from "@/assets/avatars/avatar-moderator.svg";

const avatars = [
	"_",
	patientAvatar,
	teacherAvatar,
	frontdeskAvatar,
	studentAvatar,
	adminAvatar,
];

const TemplatePanel = ({ children }) => {
	const { user, handleLogOut } = useUser();

	return (
		<Container fixed>
			<Grid
				container
				flexDirection={"column"}
				alignItems="center"
				justifyContent="space-between"
				style={{
					minHeight: "100dvh",
					paddingTop: 44,
					paddingBottom: 44,
				}}
			>
				<Grid
					container
					alignItems={"center"}
					flexDirection={"row"}
					width={"100%"}
					justifyContent={"space-between"}
					flexWrap={"nowrap"}
				>
					<Box
						component={"div"}
						width={"100%"}
						height={44}
						sx={{
							svg: {
								height: "100%",
								width: "auto",
							},
						}}
					>
						<DentalhubLogo />
					</Box>

					<Box
						component={"div"}
						gap={"8px"}
						width={"100%"}
						display={"flex"}
						alignItems={"center"}
						justifyContent={"center"}
					>
						{user.userType && (
							<Image
								src={avatars[user.userType]}
								alt="Avatar com ícone representativo"
							/>
						)}
						<span>{user.name}</span>
					</Box>
					<Box
						component={"div"}
						width={"100%"}
						display={"flex"}
						alignItems={"center"}
						justifyContent={"flex-end"}
					>
						<Button
							color="error"
							variant="outlined"
							size="small"
							onClick={handleLogOut}
						>
							Sair
						</Button>
					</Box>
				</Grid>

				{children}

				<Grid
					container
					alignItems={"center"}
					flexDirection={"row"}
					width={"100%"}
					justifyContent={"space-between"}
					flexWrap={"nowrap"}
				>
					<Typography variant="body2" color={"GrayText"}>
						Todos os direitos reservados © Dentalhub
					</Typography>
					<Box>
						<Image src={logoUnifenas} alt="Logo Unifenas" />
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};

export default TemplatePanel;
