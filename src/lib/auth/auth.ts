import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import { credentials } from '$lib/auth/credentials';

export const { handle } = SvelteKitAuth(async (event) => {
	return {
		providers: [credentials(event.platform?.env.PASSWORD)],
		trustHost: true,
		secret: event.platform?.env.AUTH_SECRET
	} satisfies SvelteKitAuthConfig;
});
