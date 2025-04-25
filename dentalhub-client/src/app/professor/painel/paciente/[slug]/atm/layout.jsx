import { TreatmentProvider } from "@/providers/treatment-provider";

export default function TreatmentPanelLayout({ children }) {
	return <TreatmentProvider>{children}</TreatmentProvider>;
}
