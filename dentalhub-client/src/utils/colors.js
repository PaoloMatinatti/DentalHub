import { red, blue, green, yellow, purple } from "@mui/material/colors";

const colors = [red, blue, green, yellow, purple];

export function getRandomColor() {
	const randomIndex = Math.floor(Math.random() * colors.length);
	return colors[randomIndex][500];
}
