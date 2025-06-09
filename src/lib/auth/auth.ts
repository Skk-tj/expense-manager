import { SvelteKitAuth } from '@auth/sveltekit';
import { credentials } from '$lib/auth/credentials';

export const { handle } = SvelteKitAuth({
	providers: [credentials]
});
