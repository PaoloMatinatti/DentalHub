import { TextField, Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import InputMask from "react-input-mask";
import dental from "@/services/dental-api";
import routes, { protectedRoutes } from "@/app/routes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFrontdesk } from "@/providers/frontdesk-provider";

const FormResponsibleData = ({
	event,
	patient,
	setPatient,
	handleBackButtonClick,
	disableSaveAndEdit,
	view,
}) => {
	const [submitLoading] = useState(false);
	const { handleBookPresence } = useFrontdesk();
	const router = useRouter();

	const [responsibles, setResponsibles] = useState(
		patient?.responsible?.["$values"]
			? [
					patient.responsible["$values"][0]
						? {
								name: patient.responsible["$values"][0]
									.regularPatient.name,
								cpf: patient.responsible["$values"][0]
									.regularPatient.cpf,
								id: patient.responsible["$values"][0]
									.regularPatient.id,
							}
						: {},
					patient.responsible["$values"][1]
						? {
								name: patient.responsible["$values"][1]
									.regularPatient.name,
								cpf: patient.responsible["$values"][1]
									.regularPatient.cpf,
								id: patient.responsible["$values"][1]
									.regularPatient.id,
							}
						: {},
					patient.responsible["$values"][2]
						? {
								name: patient.responsible["$values"][2]
									.regularPatient.name,
								cpf: patient.responsible["$values"][2]
									.regularPatient.cpf,
								id: patient.responsible["$values"][2]
									.regularPatient.id,
							}
						: {},
				]
			: [{}, {}, {}],
	);

	const handleCpfBlur = async (event, index) => {
		if (disableSaveAndEdit) {
			return;
		}

		const rawCpf = event.target.value;
		const cpf = rawCpf.replace(/[^\d]/g, "");

		if (!cpf) return;

		try {
			const response = await dental.responsibles.create({
				cpf,
				id: patient.id,
			});

			let newResponsibles = [...responsibles];

			if (response) {
				toast.success("Responsável adicionado");

				newResponsibles[index] = {
					name: response.regularPatient.name,
					cpf: response.regularPatient.cpf,
					id: response.regularPatient.id,
				};

				setResponsibles(newResponsibles);
			}
		} catch (error) {
			toast.error("Erro ao buscar responsável");
			console.error("Erro ao buscar responsável:", error);
		}
	};

	const handleDeleteResponsible = async (index) => {
		const rawCpf = responsibles[index].cpf;
		const cpf = rawCpf.replace(/[^\d]/g, "");

		if (!cpf) return;

		try {
			const response = await dental.responsibles.delete({
				cpf,
				id: patient.id,
			});

			let newResponsibles = [...responsibles];

			if (response) {
				toast.success("Responsável removido");

				newResponsibles[index] = {};

				setResponsibles(newResponsibles);
			}
		} catch (error) {
			toast.error("Erro ao buscar responsável");
			console.error("Erro ao buscar responsável:", error);
		}
	};

	React.useEffect(() => {
		setPatient((value) => ({
			...value,
			responsible: {
				$values: [
					responsibles[0].name
						? {
								regularPatient: {
									name: responsibles[0].name,
									cpf: responsibles[0].cpf,
								},
							}
						: undefined,
					responsibles[1].name
						? {
								regularPatient: {
									name: responsibles[1].name,
									cpf: responsibles[1].cpf,
								},
							}
						: undefined,
					responsibles[2].name
						? {
								regularPatient: {
									name: responsibles[2].name,
									cpf: responsibles[2].cpf,
								},
							}
						: undefined,
				],
			},
		}));
	}, [responsibles, setPatient]);

	return (
		<Box display="flex" flexDirection="column" justifyContent="center">
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					if (!patient?.id) return;

					try {
						await handleBookPresence(patient?.id);
						router.push(routes.panels.frontdesk.path);
					} catch (error) {
						console.error(error);
					}
				}}
				style={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
					gap: "1.6rem",
					marginBottom: "2rem",
					borderLeft: "1px solid #e0e0e0",
				}}
				autoComplete="off"
			>
				{responsibles.map((responsible, index) => {
					return (
						<React.Fragment
							key={responsible.cpf + "-item-" + index}
						>
							<Typography>Responsável {index + 1}:</Typography>
							<div
								style={{
									display: "flex",
									flexWrap: "wrap",
									justifyContent: "center",
									alignItems: "center",
									gap: "1.6rem",
								}}
							>
								<InputMask
									mask="999.999.999-99"
									maskChar={null}
									onBlur={(e) => {
										if (
											!(
												responsible.cpf &&
												responsible.name
											)
										) {
											handleCpfBlur(e, index);
										}
									}}
									defaultValue={responsible.cpf || undefined}
								>
									{(inputProps) => (
										<TextField
											style={{
												pointerEvents:
													(responsible.cpf &&
														responsible.name) ||
													disableSaveAndEdit
														? "none"
														: "auto",
												"-webkit-text-fill-color":
													(responsible.cpf &&
														responsible.name) ||
													disableSaveAndEdit
														? "rgba(0, 0, 0, 0.38)"
														: "unset",
											}}
											{...inputProps}
											id={`${event}-cpf-1`}
											name={`responsibleCpf-${index}`}
											label="CPF"
											variant="outlined"
										/>
									)}
								</InputMask>

								<TextField
									id={`${event}-nome-1`}
									disabled
									name={`responsibleName-${index}`}
									label="Nome"
									variant="outlined"
									defaultValue={responsible.name || undefined}
									inputProps={{
										maxLength: 50,
									}}
								/>
								{responsible.name &&
									responsible.cpf &&
									!disableSaveAndEdit && (
										<>
											<Button
												variant="outlined"
												color="clinicBlue"
												LinkComponent={Link}
												target="_blank"
												href={
													protectedRoutes[view - 1] +
													"/paciente/" +
													responsible?.id
												}
												sx={{ height: "100%" }}
											>
												Ver
											</Button>
											<Button
												variant="outlined"
												color="secondary"
												onClick={() =>
													handleDeleteResponsible(
														index,
													)
												}
												sx={{ height: "100%" }}
											>
												Remover
											</Button>
										</>
									)}
							</div>
						</React.Fragment>
					);
				})}

				<div
					style={{
						display: "flex",
						gap: "1.8rem",
						width: "95%",
					}}
				>
					<Button
						variant="outlined"
						{...(() => {
							if (!patient) {
								return {
									href: routes.panels.frontdesk.path,
								};
							}

							return {
								onClick: handleBackButtonClick,
							};
						})()}
						sx={{
							width: "100%",
						}}
					>
						Voltar
					</Button>

					{!disableSaveAndEdit && (
						<>
							<Button
								disabled={submitLoading || disableSaveAndEdit}
								type="button"
								onClick={() =>
									router.push(routes.panels.frontdesk.path)
								}
								variant="contained"
								color="info"
								sx={{
									width: "100%",
								}}
							>
								Salvar
							</Button>
							<Button
								disabled={submitLoading || disableSaveAndEdit}
								type="submit"
								variant="contained"
								sx={{
									width: "100%",
								}}
							>
								Salvar e Marcar Presença
							</Button>
						</>
					)}
				</div>
			</form>
		</Box>
	);
};

export default FormResponsibleData;
