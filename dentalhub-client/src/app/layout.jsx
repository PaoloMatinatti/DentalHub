import { Inter, Roboto } from "next/font/google";

import GlobalStyles from "@mui/material/GlobalStyles";
import { CssBaseline } from "@mui/material";
import { ApiProvider } from "@/providers/api-provider";
import { UserProvider } from "@/providers/user-provider";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = {
	title: {
		default: "Boas vindas ao Dentalhub.",
		template: `%s | Dentalhub`,
	},

	robots: "noindex, nofollow",
	appleWebApp: true,
};

export const viewport = {
	themeColor: "#ffffff",
	colorScheme: "normal",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export default function RootLayout({ children }) {
	return (
		<html lang="pt-br">
			<body className={`${inter.className} ${roboto.className}`}>
				<CssBaseline />
				<GlobalStyles />

				<ApiProvider>
					<UserProvider>{children}</UserProvider>
				</ApiProvider>
			</body>
		</html>
	);
}
