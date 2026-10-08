import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import { env } from 'cloudflare:workers';

import { credentials } from '#lib/auth/credentials.js';

export const { handle } = SvelteKitAuth(async () => {
	return {
		providers: [credentials(env.PASSWORD ?? '')],
		trustHost: true,
		secret: env.AUTH_SECRET
	} satisfies SvelteKitAuthConfig;
});
