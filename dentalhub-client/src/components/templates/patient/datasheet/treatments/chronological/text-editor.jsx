"use client";

import { Button, Grid } from "@mui/material";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
	MenuButtonBold,
	MenuButtonItalic,
	MenuButtonUnderline,
	MenuControlsContainer,
	MenuDivider,
	MenuSelectHeading,
	MenuSelectTextAlign,
	RichTextEditor,
} from "mui-tiptap";
import { useRef } from "react";
import styles from "./style.module.css";
import TextAlign from "@tiptap/extension-text-align";

export const TipTap = ({ callback, defaultValue, disabled }) => {
	const rteRef = useRef(null);

	return (
		<div
			style={{
				pointerEvents: disabled ? "none" : "auto",
				opacity: disabled ? 0.6 : 1,
			}}
		>
			<RichTextEditor
				ref={rteRef}
				extensions={[
					StarterKit,
					Underline,
					TextAlign.configure({
						types: ["heading", "paragraph"],
					}),
				]}
				className={styles.richtext}
				content={defaultValue}
				renderControls={() => (
					<MenuControlsContainer>
						<MenuSelectHeading />
						<MenuDivider />
						<MenuButtonBold />
						<MenuButtonItalic />
						<MenuButtonUnderline />
						<MenuSelectTextAlign />
						<MenuDivider />
					</MenuControlsContainer>
				)}
			/>

			{!disabled && (
				<Grid
					container
					sx={{
						width: "100%",
						justifyContent: "flex-end",
					}}
				>
					<Button
						variant="contained"
						sx={{
							width: 420,
						}}
						onClick={() =>
							callback(rteRef.current?.editor?.getHTML())
						}
					>
						Salvar
					</Button>
				</Grid>
			)}
		</div>
	);
};
