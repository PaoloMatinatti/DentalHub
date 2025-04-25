import TemplatePanel from "@/components/templates/panel";
import { PatientProvider } from "@/providers/patient-provider";

export default function ReceptionPanelLayout({ children }) {
	return (
		<>
			<TemplatePanel>
				<PatientProvider>{children}</PatientProvider>
			</TemplatePanel>
		</>
	);
}
