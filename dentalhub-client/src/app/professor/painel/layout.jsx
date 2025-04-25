import TemplatePanel from "@/components/templates/panel";
import { PatientProvider } from "@/providers/patient-provider";
import { Toaster } from "sonner";

export default function TeacherPanelLayout({ children, params: { slug } }) {
	return (
		<PatientProvider patientId={slug}>
			<Toaster richColors closeButton />
			<TemplatePanel>{children}</TemplatePanel>
		</PatientProvider>
	);
}
