"use client";

import { useRouter } from "next/navigation";
import React from "react";

const Context = React.createContext({});
import { protectedRoutes } from "@/app/routes";
import { toast } from "sonner";
import dental from "@/services/dental-api";
import { useUser } from "./user-provider";

export const TreatmentProvider = ({ children, patientId, treatmentId }) => {
	const { user } = useUser();
	const router = useRouter();

	const [treatment, setTreatment] = React.useState(null);
	const [depedentList, setDependentList] = React.useState([]);
	const [isLoaded, setIsLoaded] = React.useState(false);

	const handleUpdateTreatment = React.useCallback((data) => {
		setTreatment((value) => ({
			...value,
			...data,
		}));
	}, []);

	React.useEffect(() => {
		if (treatment != null || treatment != undefined || !treatmentId) return;

		const getTreatment = async () => {
			try {
				const response =
					await dental.form.treatment.getById(treatmentId);

				if (response.patientId != patientId) return;
				handleUpdateTreatment(response);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoaded(true);
			}
		};

		getTreatment();
	}, [handleUpdateTreatment, treatment, treatmentId, patientId]);

	if (treatmentId && !treatment && isLoaded) {
		toast.error("Erro ao buscar tratamento");
		return router.push(
			protectedRoutes[(user?.userType || 4) - 1] ||
				"/paciente/" + patientId,
		);
	}

	return (
		<Context.Provider
			value={{
				treatment,
				handleUpdateTreatment,
				depedentList,
				setDependentList,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const useTreatment = () => React.useContext(Context);
