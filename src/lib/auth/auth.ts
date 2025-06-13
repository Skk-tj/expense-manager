import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import { credentials } from '$lib/auth/credentials';

export const { handle } = SvelteKitAuth(async (event) => {
	const password = event.platform?.env.PASSWORD;

	return {
		providers: [credentials(password)]
	} satisfies SvelteKitAuthConfig;
});
