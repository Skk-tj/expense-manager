import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();
	const currentPath = event.url.pathname;
	if (currentPath === '/auth/signin') {
		return {
			session
		};
	}

	if (session?.user === null || session?.user === undefined) {
		redirect(303, '/auth/signin');
	}

	return {
		session
	};
};
