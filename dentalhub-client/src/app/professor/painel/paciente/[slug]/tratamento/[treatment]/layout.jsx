import { TreatmentProvider } from "@/providers/treatment-provider";

export default function TreatmentPanelLayout({
	children,
	params: { slug, treatment },
}) {
	return (
		<TreatmentProvider treatmentId={treatment} patientId={slug}>
			{children}
		</TreatmentProvider>
	);
}
