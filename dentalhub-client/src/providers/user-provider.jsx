"use client";

import dental from "@/services/dental-api";
import React from "react";

const Context = React.createContext({});

export const UserProvider = ({ children }) => {
	const [user, setUser] = React.useState({});

	const isUserLoadingState = React.useState(false);
	const setIsUserLoading = isUserLoadingState[1];

	const handleUpdateUser = (data) =>
		setUser((value) => ({
			...value,
			...data,
		}));

	const handleLogOut = () => {
		dental.user.cookies.clean();
		window.location.href = "/";
	};

	React.useEffect(() => {
		if (!dental.user.getToken()) return;
		setIsUserLoading(true);

		const getUser = async () => {
			try {
				const data = await dental.user.validate();
				handleUpdateUser(data);
			} catch (error) {
				console.error(error);
			} finally {
				setIsUserLoading(false);
			}
		};

		getUser();
	}, [setIsUserLoading]);

	return (
		<Context.Provider
			value={{
				user,
				handleUpdateUser,
				handleLogOut,
				setIsUserLoading,
				isUserLoading: isUserLoadingState[0],
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const useUser = () => React.useContext(Context);
