"use client";

import { DentalhubLogo } from "@/components/core/logo";
import dental from "@/services/dental-api";

import {
	Alert,
	CardMedia,
	Grid,
	Skeleton,
	ThemeProvider,
	createTheme,
} from "@mui/material";
import React from "react";

const Context = React.createContext({});

const theme = createTheme({
	palette: {
		primary: {
			contrastText: "#fff",
			main: "#8EC193",
			dark: "#57af60",
		},
		secondary: {
			main: "#FF5733",
			blue: "#89C6FF",
		},
		clinicBlue: {
			main: "#2196F3",
		},
		neutral: {
			main: "#6750A4",
		},
	},
});

export const ApiProvider = ({ children }) => {
	const [initialLoading, setInitialLoading] = React.useState(true);
	const [hasConnection, setHasConnection] = React.useState(false);

	const currentClinicState = React.useState(null);

	React.useEffect(() => {
		const tryApiConnection = async () => {
			try {
				await dental.ping.get();
				setHasConnection(true);
			} catch (error) {
				setHasConnection(false);
				console.error(error);
			} finally {
				setInitialLoading(false);
			}
		};

		tryApiConnection();
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Context.Provider value={{ currentClinicState }}>
				{initialLoading ? (
					<Grid
						container
						spacing={1}
						flexDirection={"column"}
						gap={6}
						sx={{
							paddingTop: "80px",
							maxWidth: 400,
							margin: "0 auto",
						}}
					>
						<Skeleton variant="circular" width={80} height={80} />
						<Skeleton
							variant="rectangular"
							width={400}
							height={60}
						/>
						<Skeleton
							variant="rectangular"
							width={400}
							height={60}
						/>
						<Skeleton variant="rounded" width={400} height={60} />
						<Skeleton
							variant="rectangular"
							width={400}
							height={60}
						/>
						<Skeleton
							variant="rectangular"
							width={400}
							height={60}
						/>
						<Skeleton
							variant="rectangular"
							width={400}
							height={60}
						/>
					</Grid>
				) : hasConnection ? (
					<>{children}</>
				) : (
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
							Contate o suporte técnico do projeto. Não há conexão
							com a API Dentalhub.
						</Alert>
					</Grid>
				)}
			</Context.Provider>
		</ThemeProvider>
	);
};

export const useApi = () => React.useContext(Context);
