import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();
	const currentPath = event.url.pathname;
	if (currentPath === '/auth/login') {
		return {
			session
		};
	}

	if (session?.user === null || session?.user === undefined) {
		redirect(303, '/auth/login');
	}

	return {
		session
	};
};
