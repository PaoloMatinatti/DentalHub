import { Alert, CardMedia, Grid } from "@mui/material";
import { DentalhubLogo } from "@/components/core/logo";

export const metadata = {
	title: "Área Restrita",
};

export default function AreaRestrita() {
	return (
		<Grid
			container
			spacing={1}
			alignItems={"center"}
			gap={6}
			sx={{
				maxWidth: 400,
				margin: "80px auto 0",
			}}
		>
			<CardMedia
				sx={{
					maxWidth: "max-content",
					margin: "0 auto",
				}}
			>
				<DentalhubLogo />
			</CardMedia>
			<Alert severity="error">
				Essa área é restrita. Você não tem acesso a partir daqui.
			</Alert>
		</Grid>
	);
}
