import Cookie from "js-cookie";

import { decodeString, encodeString } from "@/utils/encode";
import { serverFetch } from "@/utils/server-fetch";
import Error from "next/error";

export const REFRESH_TIME_IN_DAYS = 5;
export const REFRESH_TIME_IN_MS = 1000 * 60 * 60 * 24 * REFRESH_TIME_IN_DAYS;

export const CURRENT_USER_COOKIE_NAME = "dentalhub_user";
export const CURRENT_TYPE_COOKIE_NAME = "dentalhub_type";

export const USERS_TYPES = {
	Patient: 1,
	Teacher: 2,
	FrontDesk: 3,
	Student: 4,
	Admin: 5,
};

class Api {
	user = {
		token: null,
		type: null,

		getToken: () => {
			return this.user.token || this.user.cookies.getToken();
		},

		cookies: {
			setToken: (clientToken) => {
				Cookie.set(
					CURRENT_USER_COOKIE_NAME,
					encodeString(clientToken),
					{
						expires: REFRESH_TIME_IN_DAYS,
					},
				);

				this.user.token = clientToken;
			},

			setType: (clientType) => {
				if (!Object.values(USERS_TYPES).includes(clientType))
					return new Error("Tipo de cliente inválido");

				Cookie.set(CURRENT_TYPE_COOKIE_NAME, encodeString(clientType), {
					expires: REFRESH_TIME_IN_DAYS,
				});

				this.user.type = clientType;
			},

			getToken: () => {
				const encodedUser = Cookie.get(CURRENT_USER_COOKIE_NAME);

				if (!encodedUser) {
					this.user.cookies.clean();
					return null;
				}

				this.user.token = decodeString(encodedUser);

				return this.user.token;
			},

			getType: () => {
				const encodedType = Cookie.get(CURRENT_TYPE_COOKIE_NAME);

				if (!encodedType) return null;

				if (
					!Object.keys(USERS_TYPES).includes(
						decodeString(encodedType),
					)
				) {
					this.client.cookies.clean();
					return new Error("Tipo de cliente inválido");
				}

				this.user.type = decodeString(encodedType);

				return this.user.type;
			},

			clean: () => {
				Cookie.remove(CURRENT_USER_COOKIE_NAME);
				Cookie.remove(CURRENT_TYPE_COOKIE_NAME);

				this.user.token = null;
				this.user.type = null;
			},
		},

		auth: async ({ username, password, type }) => {
			const response = await this.handleFetch(`/auth`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
					type,
				}),
			});

			const value = await response.json;

			if (!response.ok) {
				throw value.error;
			}

			this.user.cookies.setToken(value.token);
			this.user.cookies.setType(type);

			return value.user;
		},

		validate: async () => {
			const response = await this.handleFetch(`/auth/validate`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${this.user.getToken()}`,
				},
			});

			const value = await response.json;

			if (!response.ok) {
				this.user.cookies.clean();
				throw value.error;
			}

			return value.user;
		},
	};

	patients = {
		get: async () => {
			const regularResponse = await this.handleFetch(
				`/patients/regulars`,
				{
					method: "GET",

					headers: {
						Authorization: `Bearer ${this.user.getToken()}`,
					},
				},
			);

			const regularValue = await regularResponse.json;

			if (!regularResponse.ok) {
				throw regularValue.error_status;
			}
			const pediatricResponse = await this.handleFetch(
				`/patients/pediatrics`,
				{
					method: "GET",

					headers: {
						Authorization: `Bearer ${this.user.getToken()}`,
					},
				},
			);

			const pediatricValue = await pediatricResponse.json;

			if (!regularResponse.ok) {
				throw pediatricValue.error_status;
			}

			return [...pediatricValue, ...regularValue].sort(
				(pacientA, pacientB) =>
					pacientA.name.localeCompare(pacientB.name),
			);
		},

		create: async (data) => {
			const response = await this.handleFetch(`/patients/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",

					Authorization: `Bearer ${this.user.getToken()}`,
				},
				body: JSON.stringify(data),
			});

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},

		update: async (id, data) => {
			const response = await this.handleFetch(`/patients/update/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user.getToken()}`,
				},
				body: JSON.stringify(data),
			});

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},

		setRegularInfos: async (id, data) => {
			const response = await this.handleFetch(
				`/patients/regular/infos/${id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},
					body: JSON.stringify(data),
				},
			);

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},

		setPediatricInfos: async (id, data) => {
			const response = await this.handleFetch(
				`/patients/pediatric/infos/${id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},
					body: JSON.stringify(data),
				},
			);

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},

		getById: async (id) => {
			const response = await this.handleFetch(`/patients/${id}`, {
				method: "GET",

				headers: {
					Authorization: `Bearer ${this.user.getToken()}`,
				},
			});

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},

		report: async ({ patientId, userId, userType }) => {
			const response = await this.handleFetch(
				`/patients/${patientId}/report`,
				{
					method: "POST",

					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},

					body: JSON.stringify({
						id: userId,
						type: userType,
					}),
				},
			);

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},
	};

	address = {
		createRegular: async (patientId, data) => {
			const response = await this.handleFetch(
				`/address/create/${patientId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},
					body: JSON.stringify(data),
				},
			);

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},
		createComercial: async (patientId, data) => {
			const response = await this.handleFetch(
				`/address/comercial/create/${patientId}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${this.user.getToken()}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				},
			);

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},
	};

	terms = {
		upload: async (data) => {
			const response = await this.handleFetch(`/patients/term`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${this.user.getToken()}`,
				},
				body: data,
			});

			const value =
				typeof response.json == "function"
					? await response.json()
					: response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},
	};

	responsibles = {
		getDependents: async (id) => {
			const response = await this.handleFetch(
				`/responsibles/patient/${id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},
				},
			);

			const data =
				typeof response.json == "function"
					? await response.json()
					: response.json;

			if (!response.ok) {
				throw new Error(data.message || "Erro ao buscar dependentes");
			}

			return data;
		},
		getByCpf: async (cpf) => {
			const response = await this.handleFetch(
				`/responsibles/cpf/${cpf}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},
				},
			);

			const data =
				typeof response.json == "function"
					? await response.json()
					: response.json;

			if (!response.ok) {
				throw new Error(data.message || "Erro ao buscar responsável");
			}

			return data;
		},
		create: async ({ cpf, id }) => {
			const response = await this.handleFetch(`/responsibles/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user.getToken()}`,
				},
				body: JSON.stringify({ cpf, patientId: id }),
			});

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},
		delete: async ({ cpf, id }) => {
			const response = await this.handleFetch(`/responsibles/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user.getToken()}`,
				},
				body: JSON.stringify({ cpf, patientId: id }),
			});

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},
	};

	clinics = {
		get: async () => {
			const response = await this.handleFetch(`/clinics`, {
				method: "GET",

				headers: {
					Authorization: `Bearer ${this.user.getToken()}`,
				},
			});

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},
	};

	presences = {
		getByClinic: async (clinicId) => {
			const response = await this.handleFetch(
				`/presences/clinic/${clinicId}`,
				{
					method: "GET",

					headers: {
						Authorization: `Bearer ${this.user.getToken()}`,
					},
				},
			);

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},

		book: async ({ clinicId, patientId, frontdeskId }) => {
			const response = await this.handleFetch(`/presences`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",

					Authorization: `Bearer ${this.user.getToken()}`,
				},
				body: JSON.stringify({
					clinicId,
					patientId,
					frontdeskId,
					updatedAt: new Date().toISOString(),
					createdAt: new Date().toISOString(),
					exit: null,
				}),
			});

			const value = await response.json;

			if (!response.ok) {
				throw value.error_status;
			}

			return value;
		},

		unbook: async (clinicId) => {
			const now = new Date();

			const response = await this.handleFetch(
				`/presences/unbook/${clinicId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},
					body: JSON.stringify({
						exit: now.toISOString(),
					}),
				},
			);

			if (!response.ok) {
				throw response.error;
			}

			return response;
		},
	};

	affiliated = {
		getTeachers: async () => {
			const response = await this.handleFetch(`/affiliateds/teachers`, {
				method: "GET",

				headers: {
					Authorization: `Bearer ${this.user.getToken()}`,
				},
			});

			const data =
				typeof response.json == "function"
					? await response.json()
					: response.json;

			if (!response.ok) {
				throw data.error_status;
			}

			return data;
		},

		getStudents: async () => {
			const response = await this.handleFetch(`/affiliateds/students`, {
				method: "GET",

				headers: {
					Authorization: `Bearer ${this.user.getToken()}`,
				},
			});

			const data =
				typeof response.json == "function"
					? await response.json()
					: response.json;

			if (!response.ok) {
				throw data.error_status;
			}

			return data;
		},

		getById: async (id) => {
			const response = await this.handleFetch(`/affiliateds/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user.getToken()}`,
				},
			});

			const data =
				typeof response.json == "function"
					? await response.json()
					: response.json;

			if (!response.ok) {
				throw new Error(data.message || "Erro ao buscar afiliado");
			}

			return data;
		},
	};

	form = {
		answer: {
			set: async ({ treatmentId, question, content, highlight }) => {
				const response = await this.handleFetch(
					`/treatments/${treatmentId}/answer`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							question,
							content,
							highlight,
						}),
					},
				);

				const value = await response.json;

				if (!response.ok) {
					throw value.error_status;
				}

				return value;
			},
			get: () => {},
		},

		treatment: {
			create: async ({ patientId, name, studentId }) => {
				const response = await this.handleFetch(`/treatments`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",

						Authorization: `Bearer ${this.user.getToken()}`,
					},
					body: JSON.stringify({
						name,
						isApart: true,
						patientId,
						studentId,
						createdAt: new Date().toISOString(),
					}),
				});

				const value = await response.json;

				if (!response.ok) {
					throw value.error_status;
				}

				return value;
			},

			getByPatient: async (id) => {
				const response = await this.handleFetch(
					`/treatments/patient/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${this.user.getToken()}`,
						},
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao buscar tratamentos",
					);
				}

				return data;
			},

			getByAffiliated: async (id) => {
				const response = await this.handleFetch(
					`/treatments/affiliated/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${this.user.getToken()}`,
						},
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao buscar tratamentos",
					);
				}

				return data;
			},

			getById: async (id) => {
				const response = await this.handleFetch(`/treatments/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},
				});

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao buscar tratamentos",
					);
				}

				return data;
			},

			close: async (id) => {
				const response = await this.handleFetch(
					`/treatments/${id}/close`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${this.user.getToken()}`,
						},
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao fechar tratamento",
					);
				}

				return data;
			},
		},

		anamnese: {
			create: async ({ patientId, index, studentId }) => {
				const response = await this.handleFetch(`/anamnese`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",

						Authorization: `Bearer ${this.user.getToken()}`,
					},
					body: JSON.stringify({
						index,
						patientId,
						studentId,
						createdAt: new Date().toISOString(),
					}),
				});

				const value = await response.json;

				if (!response.ok) {
					throw value.error_status;
				}

				return value;
			},

			getByPatient: async (id) => {
				const response = await this.handleFetch(
					`/anamnese/patient/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${this.user.getToken()}`,
						},
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao buscar anamneses");
				}

				return data;
			},

			getByAffiliated: async (id) => {
				const response = await this.handleFetch(
					`/anamnese/affiliated/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${this.user.getToken()}`,
						},
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao buscar anamneses");
				}

				return data;
			},

			getById: async (id) => {
				const response = await this.handleFetch(`/anamnese/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},
				});

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao buscar anamnese");
				}

				return data;
			},

			setAnswer: async ({ anamneseId, question, content, highlight }) => {
				const response = await this.handleFetch(
					`/anamnese/${anamneseId}/answer`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							question,
							content,
							highlight,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao buscar tratamentos",
					);
				}

				return data;
			},

			setValidation: async ({
				anamneseId,
				teacherId,
				studentId,
				answersList,
			}) => {
				const response = await this.handleFetch(
					`/anamnese/${anamneseId}/validation`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							teacherId,
							studentId,
							answersList,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao enviar para validação",
					);
				}

				return data;
			},

			validate: async ({
				status,
				anamneseId,
				validationId,
				feedback,
			}) => {
				const response = await this.handleFetch(
					`/anamnese/${anamneseId}/validate`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							status,
							anamneseId,
							validationId,
							feedback,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao validar.");
				}

				return data;
			},
		},

		atm: {
			create: async ({ patientId, index, studentId }) => {
				const response = await this.handleFetch(`/atm`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",

						Authorization: `Bearer ${this.user.getToken()}`,
					},
					body: JSON.stringify({
						index,
						patientId,
						studentId,
						createdAt: new Date().toISOString(),
					}),
				});

				const value = await response.json;

				if (!response.ok) {
					throw value.error_status;
				}

				return value;
			},

			getByPatient: async (id) => {
				const response = await this.handleFetch(`/atm/patient/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},
				});

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao buscar atms");
				}

				return data;
			},

			getByAffiliated: async (id) => {
				const response = await this.handleFetch(
					`/atm/affiliated/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${this.user.getToken()}`,
						},
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao buscar atms");
				}

				return data;
			},

			getById: async (id) => {
				const response = await this.handleFetch(`/atm/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},
				});

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao buscar atm");
				}

				return data;
			},

			setAnswer: async ({ atmId, question, content, highlight }) => {
				const response = await this.handleFetch(
					`/atm/${atmId}/answer`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							question,
							content,
							highlight,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao buscar tratamentos",
					);
				}

				return data;
			},

			setValidation: async ({
				atmId,
				teacherId,
				studentId,
				answersList,
			}) => {
				const response = await this.handleFetch(
					`/atm/${atmId}/validation`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							teacherId,
							studentId,
							answersList,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao enviar para validação",
					);
				}

				return data;
			},

			validate: async ({ status, atmId, validationId, feedback }) => {
				const response = await this.handleFetch(
					`/atm/${atmId}/validate`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							status,
							atmId,
							validationId,
							feedback,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao validar.");
				}

				return data;
			},
		},

		screening: {
			create: async ({ patientId, index, studentId }) => {
				const response = await this.handleFetch(`/screening`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",

						Authorization: `Bearer ${this.user.getToken()}`,
					},
					body: JSON.stringify({
						index,
						patientId,
						studentId,
						createdAt: new Date().toISOString(),
					}),
				});

				const value = await response.json;

				if (!response.ok) {
					throw value.error_status;
				}

				return value;
			},

			getByPatient: async (id) => {
				const response = await this.handleFetch(
					`/screening/patient/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${this.user.getToken()}`,
						},
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao buscar screenings",
					);
				}

				return data;
			},

			getByAffiliated: async (id) => {
				const response = await this.handleFetch(
					`/screening/affiliated/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${this.user.getToken()}`,
						},
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao buscar screenings",
					);
				}

				return data;
			},

			getById: async (id) => {
				const response = await this.handleFetch(`/screening/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user.getToken()}`,
					},
				});

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao buscar screening");
				}

				return data;
			},

			setAnswer: async ({
				screeningId,
				question,
				content,
				highlight,
			}) => {
				const response = await this.handleFetch(
					`/screening/${screeningId}/answer`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							question,
							content,
							highlight,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao buscar tratamentos",
					);
				}

				return data;
			},

			setValidation: async ({
				screeningId,
				teacherId,
				studentId,
				answersList,
			}) => {
				const response = await this.handleFetch(
					`/screening/${screeningId}/validation`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							teacherId,
							studentId,
							answersList,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao enviar para validação",
					);
				}

				return data;
			},

			validate: async ({
				status,
				screeningId,
				validationId,
				feedback,
			}) => {
				const response = await this.handleFetch(
					`/screening/${screeningId}/validate`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							status,
							screeningId,
							validationId,
							feedback,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao validar.");
				}

				return data;
			},
		},

		plans: {
			create: async ({ treatmentId, content, studentId }) => {
				const response = await this.handleFetch(
					`/attachments/chronologicalPlan`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							content,
							treatmentId,
							studentId,
						}),
					},
				);

				const value = await response.json;

				if (!response.ok) {
					throw value.error_status;
				}

				return value;
			},

			setValidation: async ({ planId, teacherId, studentId }) => {
				const response = await this.handleFetch(
					`/attachments/chronologicalPlan/${planId}/validation`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							teacherId,
							studentId,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao enviar para validação",
					);
				}

				return data;
			},

			validate: async ({ status, plansId, validationId, feedback }) => {
				const response = await this.handleFetch(
					`/attachments/chronologicalPlan/${plansId}/validate`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							status,
							planId: plansId,
							validationId,
							feedback,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao validar.");
				}

				return data;
			},
		},

		periodontal: {
			create: async (data) => {
				const response = await this.handleFetch(
					`/attachments/periodontalChart`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: data,
					},
				);

				const value = await response.json;

				if (!response.ok) {
					throw value.error_status;
				}

				return value;
			},

			setValidation: async ({ chartId, teacherId, studentId }) => {
				const response = await this.handleFetch(
					`/attachments/periodontalChart/${chartId}/validation`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							teacherId,
							studentId,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao enviar para validação",
					);
				}

				return data;
			},

			validate: async ({
				status,
				periodontalId,
				validationId,
				feedback,
			}) => {
				const response = await this.handleFetch(
					`/attachments/periodontalChart/${periodontalId}/validate`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							status,
							planId: periodontalId,
							validationId,
							feedback,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao validar.");
				}

				return data;
			},

			getByPatient: async (id) => {
				const response = await this.handleFetch(
					`/attachments/periodontalChart/patient/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${this.user.getToken()}`,
						},
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao buscar Mapas");
				}

				return data;
			},
		},

		draw: {
			create: async (data) => {
				const response = await this.handleFetch(
					`/attachments/painDraw`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: data,
					},
				);

				const value = await response.json;

				if (!response.ok) {
					throw value.error_status;
				}

				return value;
			},

			setValidation: async ({ drawId, teacherId, studentId }) => {
				const response = await this.handleFetch(
					`/attachments/painDraw/${drawId}/validation`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							teacherId,
							studentId,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(
						data.message || "Erro ao enviar para validação",
					);
				}

				return data;
			},

			validate: async ({ status, drawId, validationId, feedback }) => {
				const response = await this.handleFetch(
					`/attachments/painDraw/${drawId}/validate`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${this.user.getToken()}`,
						},
						body: JSON.stringify({
							status,
							planId: drawId,
							validationId,
							feedback,
						}),
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao validar.");
				}

				return data;
			},

			getByAtm: async (id) => {
				const response = await this.handleFetch(
					`/attachments/painDraw/atm/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${this.user.getToken()}`,
						},
					},
				);

				const data =
					typeof response.json == "function"
						? await response.json()
						: response.json;

				if (!response.ok) {
					throw new Error(data.message || "Erro ao buscar Desenhos");
				}

				return data;
			},
		},
	};

	ping = {
		get: async () => {
			const response = await this.handleFetch(`/ping`, {
				method: "GET",
			});

			return response;
		},
	};

	handleFetch = async (input, init) => {
		return await serverFetch(input, {
			...init,
		});
	};
}

const dental = new Api();

export default dental;
