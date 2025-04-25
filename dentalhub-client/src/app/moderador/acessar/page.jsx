"use client";

import TemplateAccess from "@/components/templates/access";
import { USERS_TYPES } from "@/services/dental-api";

export default function TeacherAccess() {
	return (
		<>
			<TemplateAccess
				loginLabel={"Usuário"}
				userType={USERS_TYPES.Admin}
			/>
		</>
	);
}
