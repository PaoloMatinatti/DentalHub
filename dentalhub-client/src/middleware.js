import { NextResponse } from "next/server";
import routes, {
	authRoutes,
	protectedRoutes,
	publicRoutes,
} from "./app/routes";
import {
	CURRENT_TYPE_COOKIE_NAME,
	CURRENT_USER_COOKIE_NAME,
	USERS_TYPES,
} from "./services/dental-api";
import { decodeString } from "./utils/encode";
import { checkRoutes } from "./utils/text";

export function middleware(request) {
	const pathname = request.nextUrl.pathname;
	if (checkRoutes(publicRoutes, pathname)) {
		return NextResponse.next();
	}

	const userToken = request.cookies.get(CURRENT_USER_COOKIE_NAME);
	const userType = request.cookies.get(CURRENT_TYPE_COOKIE_NAME);

	if (userToken && userType) {
		const user = {
			token: userToken.value,
			type: parseInt(decodeString(userType.value)),
		};

		if (checkRoutes(authRoutes, pathname)) {
			return NextResponse.redirect(
				new URL(protectedRoutes[user.type - 1], request.url),
			);
		}

		if (user.type === USERS_TYPES.Admin) {
			return NextResponse.next();
		}

		if (pathname.startsWith("/relatorio/")) {
			if (user.type === 3) {
				return NextResponse.redirect(
					new URL(protectedRoutes[user.type - 1], request.url),
				);
			}
			return NextResponse.next();
		}

		let filteredProtectedRoutes = [...protectedRoutes];
		filteredProtectedRoutes.splice(user.type - 1, 1);

		if (checkRoutes(filteredProtectedRoutes, pathname)) {
			return NextResponse.redirect(
				new URL(routes.restricted.path, request.url),
			);
		}

		return NextResponse.next();
	}

	if (checkRoutes(protectedRoutes, pathname)) {
		return NextResponse.redirect(
			new URL(routes.restricted.path, request.url),
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
