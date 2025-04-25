"use client";

export const serverFetch = async (input, init) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL || "https://localhost:8081"}/api${input}`,
		{
			...init,
			headers: {
				...init.headers,
				"ngrok-skip-browser-warning": "any-value",
			},
		},
	);
	const json = await response.json();

	return {
		ok: response.ok,
		json,
	};
};
