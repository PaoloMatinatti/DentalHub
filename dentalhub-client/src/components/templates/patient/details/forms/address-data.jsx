"use client";

import {
	TextField,
	Box,
	Typography,
	Button,
	InputLabel,
	FormControl,
	Select,
	MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import InputMask from "react-input-mask";
import dental from "@/services/dental-api";
import routes from "@/app/routes";
import { removeSpecialCharacters } from "@/utils/text";

const FormAddressData = ({
	event,
	patient,
	setPatient,
	handleContinueButtonClick,
	handleBackButtonClick,
	disableSaveAndEdit,
}) => {
	const [submitLoading, setSubmitLoading] = useState(false);

	const hasComercialAddress = !(patient.isPediatric || patient.isDependent);

	return (
		<Box display="flex" flexDirection="column" justifyContent="center">
			<form
				autoComplete="off"
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
				onSubmit={async (event) => {
					event.preventDefault();

					if (disableSaveAndEdit) {
						return handleContinueButtonClick();
					}

					setSubmitLoading(true);

					let hasDifference = !!(patient.address == null);

					let hasDifferenceComercial = false;

					const data = new FormData(event.target);

					const formAddress = {
						cep: removeSpecialCharacters(data.get("cep")),
						street: data.get("street"),
						district: data.get("district"),
						city: data.get("city"),
						uf: parseInt(data.get("uf")),
						telephone: removeSpecialCharacters(
							data.get("telephone"),
						),
						number: data.get("number"),
					};

					const formComercialAddress = {
						cep: removeSpecialCharacters(data.get("cepComercial")),
						street: data.get("streetComercial"),
						district: data.get("districtComercial"),
						city: data.get("cityComercial"),
						uf: parseInt(data.get("ufComercial")),
						telephone: removeSpecialCharacters(
							data.get("telephoneComercial"),
						),
						number: data.get("numberComercial"),
					};

					if (!hasDifference) {
						Object.keys(formAddress).forEach((key) => {
							if (
								patient.address[key] &&
								formAddress[key] != patient.address[key]
							) {
								hasDifference = true;
							}
						});
					}

					if (hasComercialAddress && !hasDifferenceComercial) {
						Object.keys(formComercialAddress).forEach((key) => {
							if (
								formComercialAddress[key] &&
								formComercialAddress[key] != null &&
								(!patient.comercialAddress ||
									(patient.comercialAddress[key] &&
										formComercialAddress[key] !=
											patient.comercialAddress[key]))
							) {
								hasDifferenceComercial = true;
							}
						});
					}

					if (hasDifference) {
						try {
							const response = await dental.address.createRegular(
								patient.id,
								formAddress,
							);
							setPatient((value) => ({
								...value,
								address: response,
							}));
						} catch (error) {
							console.error(error);
						}
					}

					if (hasComercialAddress && hasDifferenceComercial) {
						try {
							const response =
								await dental.address.createComercial(
									patient.id,
									formComercialAddress,
								);

							setPatient((value) => ({
								...value,
								comercialAddress: response,
							}));
						} catch (error) {
							console.error(error);
						}
					}

					setSubmitLoading(false);

					handleContinueButtonClick();
				}}
			>
				<Typography mb={1}>Endereço Residencial:</Typography>

				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "center",
						gap: "1.6rem",
					}}
				>
					<TextField
						disabled={disableSaveAndEdit}
						id={`${event}-endereco-residencial`}
						label="Endereço"
						name="street"
						variant="outlined"
						required={true}
						defaultValue={patient?.address?.street}
						inputProps={{
							maxLength: 50,
						}}
					/>
					<TextField
						disabled={disableSaveAndEdit}
						id={`${event}-bairro-residencial`}
						label="Bairro"
						name="district"
						variant="outlined"
						required={true}
						defaultValue={patient?.address?.district}
						inputProps={{
							maxLength: 30,
						}}
					/>
					<TextField
						disabled={disableSaveAndEdit}
						id={`${event}-cidade-residencial`}
						label="Cidade"
						name="city"
						variant="outlined"
						required={true}
						defaultValue={patient?.address?.city}
						inputProps={{
							maxLength: 30,
						}}
					/>
					<TextField
						disabled={disableSaveAndEdit}
						id={`${event}-numero-residencial`}
						sx={{ width: "92px" }}
						label="Número"
						name="number"
						variant="outlined"
						required={true}
						defaultValue={patient?.address?.number}
						inputProps={{
							maxLength: 7,
						}}
					/>
					<FormControl variant="outlined" required>
						<InputLabel id={`${event}-field-7-label`}>
							UF
						</InputLabel>
						<Select
							disabled={disableSaveAndEdit}
							labelId={`${event}-field-7-label`}
							id={`${event}-field-7`}
							sx={{ width: "92px" }}
							label="UF"
							defaultValue={patient?.address?.uf}
							InputLabelProps={{
								shrink: !!patient || undefined,
							}}
							name="uf"
						>
							<MenuItem value={1}>AC</MenuItem>
							<MenuItem value={2}>AL</MenuItem>
							<MenuItem value={3}>AP</MenuItem>
							<MenuItem value={4}>AM</MenuItem>
							<MenuItem value={5}>BA</MenuItem>
							<MenuItem value={6}>CE</MenuItem>
							<MenuItem value={7}>DF</MenuItem>
							<MenuItem value={8}>ES</MenuItem>
							<MenuItem value={9}>GO</MenuItem>
							<MenuItem value={10}>MA</MenuItem>
							<MenuItem value={11}>MT</MenuItem>
							<MenuItem value={12}>MS</MenuItem>
							<MenuItem value={13}>MG</MenuItem>
							<MenuItem value={14}>PA</MenuItem>
							<MenuItem value={15}>PB</MenuItem>
							<MenuItem value={16}>PR</MenuItem>
							<MenuItem value={17}>PE</MenuItem>
							<MenuItem value={18}>PI</MenuItem>
							<MenuItem value={19}>RJ</MenuItem>
							<MenuItem value={20}>RN</MenuItem>
							<MenuItem value={21}>RS</MenuItem>
							<MenuItem value={22}>RO</MenuItem>
							<MenuItem value={23}>RR</MenuItem>
							<MenuItem value={24}>SC</MenuItem>
							<MenuItem value={25}>SP</MenuItem>
							<MenuItem value={26}>SE</MenuItem>
							<MenuItem value={27}>TO</MenuItem>
						</Select>
					</FormControl>
					<InputMask
						mask="99999-999"
						maskChar={null}
						defaultValue={patient?.address?.cep}
					>
						{() => (
							<TextField
								style={{
									pointerEvents: disableSaveAndEdit
										? "none"
										: "auto",
									"-webkit-text-fill-color":
										disableSaveAndEdit
											? "rgba(0, 0, 0, 0.38)"
											: "unset",
								}}
								id={`${event}-cep-residencial`}
								label="CEP"
								name="cep"
								variant="outlined"
								required={true}
							/>
						)}
					</InputMask>
					<InputMask
						mask="(99) 99999-9999"
						maskChar={null}
						defaultValue={patient?.address?.telephone}
					>
						{() => (
							<TextField
								style={{
									pointerEvents: disableSaveAndEdit
										? "none"
										: "auto",
									"-webkit-text-fill-color":
										disableSaveAndEdit
											? "rgba(0, 0, 0, 0.38)"
											: "unset",
								}}
								id={`${event}-telefone-residencial`}
								label="Telefone"
								name="telephone"
								variant="outlined"
								required={true}
							/>
						)}
					</InputMask>
				</div>
				{hasComercialAddress && (
					<>
						<Typography mb={1}>Endereço Comercial:</Typography>

						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								justifyContent: "center",
								gap: "1.6rem",
							}}
						>
							<TextField
								disabled={disableSaveAndEdit}
								id={`${event}-endereco-comercial`}
								name="streetComercial"
								label="Endereço"
								variant="outlined"
								defaultValue={patient?.comercialAddress?.street}
								inputProps={{
									maxLength: 50,
								}}
							/>
							<TextField
								disabled={disableSaveAndEdit}
								id={`${event}-bairro-comercial`}
								name="districtComercial"
								label="Bairro"
								variant="outlined"
								defaultValue={
									patient?.comercialAddress?.district
								}
								inputProps={{
									maxLength: 30,
								}}
							/>
							<TextField
								disabled={disableSaveAndEdit}
								id={`${event}-cidade-comercial`}
								name="cityComercial"
								label="Cidade"
								variant="outlined"
								defaultValue={patient?.comercialAddress?.city}
								inputProps={{
									maxLength: 30,
								}}
							/>
							<TextField
								disabled={disableSaveAndEdit}
								id={`${event}-numero-comercial`}
								name="numberComercial"
								sx={{ width: "92px" }}
								label="Número"
								variant="outlined"
								defaultValue={patient?.comercialAddress?.number}
								inputProps={{
									maxLength: 7,
								}}
							/>
							<FormControl variant="outlined">
								<InputLabel id={`${event}-field-7-label`}>
									UF
								</InputLabel>
								<Select
									disabled={disableSaveAndEdit}
									labelId={`${event}-field-7-label`}
									name="ufComercial"
									id={`${event}-field-7`}
									sx={{ width: "92px" }}
									label="UF"
									defaultValue={patient?.comercialAddress?.uf}
									InputLabelProps={{
										shrink: !!patient || undefined,
									}}
								>
									<MenuItem value={1}>AC</MenuItem>
									<MenuItem value={2}>AL</MenuItem>
									<MenuItem value={3}>AP</MenuItem>
									<MenuItem value={4}>AM</MenuItem>
									<MenuItem value={5}>BA</MenuItem>
									<MenuItem value={6}>CE</MenuItem>
									<MenuItem value={7}>DF</MenuItem>
									<MenuItem value={8}>ES</MenuItem>
									<MenuItem value={9}>GO</MenuItem>
									<MenuItem value={10}>MA</MenuItem>
									<MenuItem value={11}>MT</MenuItem>
									<MenuItem value={12}>MS</MenuItem>
									<MenuItem value={13}>MG</MenuItem>
									<MenuItem value={14}>PA</MenuItem>
									<MenuItem value={15}>PB</MenuItem>
									<MenuItem value={16}>PR</MenuItem>
									<MenuItem value={17}>PE</MenuItem>
									<MenuItem value={18}>PI</MenuItem>
									<MenuItem value={19}>RJ</MenuItem>
									<MenuItem value={20}>RN</MenuItem>
									<MenuItem value={21}>RS</MenuItem>
									<MenuItem value={22}>RO</MenuItem>
									<MenuItem value={23}>RR</MenuItem>
									<MenuItem value={24}>SC</MenuItem>
									<MenuItem value={25}>SP</MenuItem>
									<MenuItem value={26}>SE</MenuItem>
									<MenuItem value={27}>TO</MenuItem>
								</Select>
							</FormControl>
							<InputMask
								mask="99999-999"
								maskChar={null}
								defaultValue={patient?.comercialAddress?.cep}
							>
								{() => (
									<TextField
										style={{
											pointerEvents: disableSaveAndEdit
												? "none"
												: "auto",
											"-webkit-text-fill-color":
												disableSaveAndEdit
													? "rgba(0, 0, 0, 0.38)"
													: "unset",
										}}
										id={`${event}-cep-comercial`}
										name="cepComercial"
										label="CEP"
										variant="outlined"
										defaultValue={
											patient?.comercialAddress?.cep
										}
									/>
								)}
							</InputMask>
							<InputMask
								mask="(99) 99999-9999"
								maskChar={null}
								defaultValue={
									patient?.comercialAddress?.telephone
								}
							>
								{() => (
									<TextField
										style={{
											pointerEvents: disableSaveAndEdit
												? "none"
												: "auto",
											"-webkit-text-fill-color":
												disableSaveAndEdit
													? "rgba(0, 0, 0, 0.38)"
													: "unset",
										}}
										id={`${event}-telefone-comercial`}
										name="telephoneComercial"
										label="Telefone"
										variant="outlined"
									/>
								)}
							</InputMask>
						</div>
					</>
				)}
				<div
					style={{
						display: "flex",
						gap: "1.8rem",
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
							width: "210px",
						}}
					>
						Voltar
					</Button>
					<Button
						disabled={submitLoading}
						type="submit"
						variant="contained"
						sx={{
							marginRight: "1.5rem",
							width: "210px",
						}}
					>
						{patient ? "Próximo" : "Cadastrar"}
					</Button>
				</div>
			</form>
		</Box>
	);
};

export default FormAddressData;
