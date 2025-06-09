import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (session?.user === null || session?.user === undefined) {
		redirect(303, '/auth/login');
	}

	return {
		session
	};
};
