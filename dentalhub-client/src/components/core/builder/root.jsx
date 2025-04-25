"use client";

import React from "react";

const Context = React.createContext({});

export const BuilderRoot = ({
	file,
	children,
	data,
	disabled = false,
	targetName = "anamnese",
}) => {
	const [answers, setAnswers] = React.useState({});

	React.useEffect(() => {
		setAnswers(data.answers);
	}, [data.answers]);

	return (
		<Context.Provider
			value={{
				questions: file.questions,
				answers,
				disabled,
				setAnswers,
				data,
				targetName,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const useBuilder = () => React.useContext(Context);
