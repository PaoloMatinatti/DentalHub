"use client";

import dental from "@/services/dental-api";
import React from "react";

import { toast } from "sonner";
import { useUser } from "./user-provider";

const Context = React.createContext({});

export const FrontdeskProvider = ({ children }) => {
	const { user, setIsUserLoading } = useUser();

	const [frontdesk, setFrontdesk] = React.useState(null);

	const currentClinicState = React.useState(null);
	const presenceListState = React.useState([]);

	const [presenceList, setPresenceList] = presenceListState;
	const [currentClinic] = currentClinicState;

	const handleBookPresence = async (id) => {
		try {
			setIsUserLoading(true);

			if (presenceList.find((presence) => presence.patient.id == id))
				return toast.warning(
					"Esse paciente já está na lista de presença.",
				);

			const response = await dental.presences.book({
				clinicId: currentClinic?.id || 1,
				patientId: id,
				frontdeskId: user.userType == 5 ? 1 : user.id,
			});

			setPresenceList((oldValues) => [...oldValues, response]);

			toast.success("Paciente adicionado a lista de presença.");
		} catch (error) {
			console.error(error);
		} finally {
			setIsUserLoading(false);
		}
	};

	const handleUpdateFrontdesk = (data) => {
		setFrontdesk((value) => ({
			...value,
			...data,
		}));
	};

	return (
		<Context.Provider
			value={{
				frontdesk,
				handleUpdateFrontdesk,
				handleBookPresence,
				currentClinicState,
				presenceListState,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const useFrontdesk = () => React.useContext(Context);
