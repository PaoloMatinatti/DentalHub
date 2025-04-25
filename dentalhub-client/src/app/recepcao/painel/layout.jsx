import TemplatePanel from "@/components/templates/panel";
import { FrontdeskProvider } from "@/providers/frontdesk-provider";
import { Toaster } from "sonner";

export default function ReceptionPanelLayout({ children }) {
	return (
		<>
			<Toaster richColors closeButton />
			<TemplatePanel>
				<FrontdeskProvider>{children}</FrontdeskProvider>
			</TemplatePanel>
		</>
	);
}
