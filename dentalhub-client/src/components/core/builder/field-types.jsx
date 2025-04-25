import {
	FormControlLabel,
	Checkbox,
	TextField,
	Typography,
} from "@mui/material";
import React from "react";

export const fieldPerType = {
	text: ({
		question,
		setValue,
		questionIndex,
		answerIndex,
		initialValue,
	}) => (
		<>
			<TextField
				placeholder={question?.label || ""}
				sx={{ marginBottom: 2 }}
				required
				key={questionIndex + question.index + answerIndex}
				defaultValue={initialValue?.[answerIndex || 0]}
				onChange={(e) =>
					setValue(
						questionIndex || question.index,
						e.target.value != "" && e.target.value != null
							? questionIndex
								? { [answerIndex || 0]: e.target.value }
								: `${e.target.value}`
							: null,
						answerIndex || 0,
					)
				}
			/>
		</>
	),
	multioption: ({ question, setValue, initialValue }) => (
		<>
			{question?.items?.map((item, index) => {
				if (typeof item === "string") {
					return (
						<FormControlLabel
							control={
								<Checkbox
									defaultChecked={
										initialValue?.[index] !== null &&
										initialValue?.[index] !== undefined
									}
								/>
							}
							onChange={(e) =>
								setValue(
									question.index,
									e.target.checked ? index : undefined,
									index,
								)
							}
							label={item}
							key={index + `${initialValue?.[index]}`}
						/>
					);
				}
				if (typeof item === "object" && item.type) {
					const InsideField = fieldPerType[item.type];

					return (
						<React.Fragment key={item.index}>
							<Typography
								variant="body2"
								sx={{ marginBottom: 1 }}
							>
								{item.label}
							</Typography>

							<InsideField
								question={item}
								questionIndex={question.index}
								answerIndex={index}
								setValue={setValue}
								initialValue={initialValue?.[index]}
							/>
						</React.Fragment>
					);
				}
			})}

			{question.others && (
				<>
					<Typography variant="body2" sx={{ marginBottom: 1 }}>
						Outros:
					</Typography>
					<TextField
						key={"other-" + question.id}
						placeholder="Outros"
						defaultValue={initialValue?.[question.items.length]}
						onChange={(e) =>
							setValue(
								question.index,
								e.target.value != "" && e.target.value != null
									? `${e.target.value}`
									: null,
								question.items.length,
							)
						}
						sx={{ marginBottom: 2 }}
					/>
				</>
			)}
		</>
	),
};
