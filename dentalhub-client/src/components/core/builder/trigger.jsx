"use client";

import { useBuilder } from "./root";

export const BuilderTrigger = ({ callback, children }) => {
	const { answers } = useBuilder();

	const handleOnClick = () => {
		callback(answers);
	};

	return <div onClick={handleOnClick}>{children}</div>;
};
