"use client";

import {
	Typography,
	FormGroup,
	Card,
	CardContent,
	Button,
} from "@mui/material";
import { useBuilder } from "./root";
import React from "react";
import { toast } from "sonner";
import dental from "@/services/dental-api";
import { fieldPerType } from "./field-types";
import pako from "pako";

export const BuilderList = () => {
	const { questions, setAnswers, data, disabled, targetName } = useBuilder();
	const fieldListRef = React.useRef({});

	React.useEffect(() => {
		if (Object.keys(fieldListRef.current).length != 0) return;

		fieldListRef.current = data.answers;
	}, [data.answers]);

	return (
		<>
			{questions.map((question) => {
				const initialValue = data.answers?.[question?.index]?.answers;

				const handleFieldValue = (
					questionIndex,
					value = null,
					position,
				) => {
					if (disabled) return;

					fieldListRef.current[questionIndex] = {
						id: null,
						answers: {
							...(fieldListRef.current[questionIndex]?.answers ||
								{}),
							[position]: value,
						},
					};
				};

				const Field = fieldPerType[question.type] ? (
					fieldPerType[question.type]
				) : (
					<></>
				);

				return (
					<Card
						key={question.index}
						sx={{
							width: "100%",
						}}
						variant="outlined"
					>
						<CardContent
							component={"form"}
							style={{
								pointerEvents: disabled ? "none" : "auto",
								"-webkit-text-fill-color": disabled
									? "rgba(0, 0, 0, 0.38)"
									: "unset",
							}}
							onSubmit={async (event) => {
								event.preventDefault();
								if (disabled) return;

								if (data?.[`${targetName}Id`] == undefined)
									return toast.error("Algo deu errado.");

								const jsonString = JSON.stringify(
									fieldListRef.current[question.index],
								);

								const compressedData = pako.deflate(
									jsonString,
									{
										to: "string",
									},
								);

								const compressedBase64 = btoa(
									String.fromCharCode.apply(
										null,
										compressedData,
									),
								);

								try {
									const response = await dental.form[
										targetName
									].setAnswer({
										[`${targetName}Id`]:
											data[`${targetName}Id`],
										question: question.index,
										highlight: !!question.highlight,
										content: compressedBase64,
									});

									toast.success(
										`Pergunta: ${question.index} respondida com sucesso.`,
									);

									fieldListRef.current[question.index] = {
										...fieldListRef.current[question.index],
										id: response.id,
									};

									setAnswers((oldValue) => ({
										...oldValue,
										...fieldListRef.current,
									}));
								} catch (error) {
									console.error(error);
								}
							}}
						>
							<Typography variant="body1">
								{question.label}
							</Typography>
							<Typography variant="body2" mb={2}>
								{question.description}
							</Typography>
							<FormGroup>
								<Field
									question={question}
									setValue={handleFieldValue}
									initialValue={initialValue}
								/>
							</FormGroup>

							{!disabled && (
								<Button type="submit" variant="outlined">
									Salvar Resposta
								</Button>
							)}
						</CardContent>
					</Card>
				);
			})}
		</>
	);
};
