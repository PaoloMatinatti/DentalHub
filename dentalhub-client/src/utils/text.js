export function formatCPF(cpf) {
	cpf = cpf.replace(/\D/g, "");

	cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
	cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
	cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

	return cpf;
}

export function checkRoutes(routes, route) {
	let isIncluded = false;
	const sanitizedRoute =
		"/" + [route.split("/")[1], route.split("/")[2]].join("/");

	routes.forEach((item) => {
		if (item.includes(sanitizedRoute)) {
			isIncluded = true;
		}
	});

	return isIncluded;
}

export function removeSpecialCharacters(text) {
	if (!text) return text;
	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9]/g, "");
}

export function handleStatusMessage(status) {
	return (
		{
			Espera: "Em espera",
			Progresso: "Em progresso",
			Validando: "Aguardando validação",
			Aprovado: "Aprovado",
			Reprovado: "Reprovado",
			Observacoes: "Aprovado com observações",
			Cancelado: "Cancelado",
		}[status] || "Indefinido"
	);
}

export function handleStatusColor(status) {
	return (
		{
			Espera: "info",
			Progresso: "info",
			Validando: "info",
			Aprovado: "success",
			Reprovado: "error",
			Observacoes: "warning",
			Cancelado: "secondary",
		}[status] || "default"
	);
}
