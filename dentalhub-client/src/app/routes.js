const routes = {
	home: {
		path: "/",
	},

	access: {
		patient: {
			path: "/paciente/acessar",
		},
		frontdesk: {
			path: "/recepcao/acessar",
		},
		student: {
			path: "/aluno/acessar",
		},
		teacher: {
			path: "/professor/acessar",
		},
		moderator: {
			path: "/moderador/acessar",
		},
	},

	panels: {
		moderator: {
			path: "/moderador/painel",
		},
		patient: {
			path: "/paciente/painel",
			details: {
				path: "/paciente/painel/%5Bslug%5D/detalhes",
			},
		},
		frontdesk: {
			path: "/recepcao/painel",

			patient: {
				register: {
					path: "/recepcao/painel/paciente/cadastrar",
				},
				details: {
					path: "/recepcao/painel/paciente",
				},
			},
		},
		student: {
			path: "/aluno/painel",

			patient: {
				details: {
					path: "/aluno/painel/paciente",
				},
			},
		},
		teacher: {
			path: "/professor/painel",
		},
	},

	restricted: {
		path: "/area-restrita",
	},
};

export const protectedModeratorRoutes = routes.panels.moderator.path;
export const protectedPatientRoutes = routes.panels.patient.path;
export const protectedTeacherRoutes = routes.panels.teacher.path;
export const protectedFrontdeskRoutes = routes.panels.frontdesk.path;
export const protectedStudentRoutes = routes.panels.student.path;

export const protectedRoutes = [
	protectedPatientRoutes,
	protectedTeacherRoutes,
	protectedFrontdeskRoutes,
	protectedStudentRoutes,
	protectedModeratorRoutes,
];

export const authRoutes = [
	routes.access.patient.path,
	routes.access.teacher.path,
	routes.access.frontdesk.path,
	routes.access.student.path,
	routes.access.moderator.path,
];

export const publicRoutes = [routes.home.path, routes.restricted.path];

export default routes;
