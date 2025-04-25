import TemplateAccess from "@/components/templates/access";

export default function PatientAccess() {
	return (
		<>
			<TemplateAccess loginLabel={"CPF"} userType={1} />
		</>
	);
}
