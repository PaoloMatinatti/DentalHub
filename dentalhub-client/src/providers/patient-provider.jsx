"use client";

import React from "react";

const Context = React.createContext({});

export const PatientProvider = ({ children }) => {
	const [patient, setPatient] = React.useState(null);
	const [depedentList, setDependentList] = React.useState([]);

	const handleUpdatePatient = (data) => {
		setPatient((value) => ({
			...value,
			...data,
		}));
	};

	return (
		<Context.Provider
			value={{
				patient,
				handleUpdatePatient,
				depedentList,
				setDependentList,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const usePatient = () => React.useContext(Context);
