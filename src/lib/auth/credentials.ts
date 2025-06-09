import Credentials from '@auth/sveltekit/providers/credentials';
import { PASSWORD } from '$env/static/private';

export const credentials = Credentials({
	credentials: {
		password: { label: 'Password', type: 'password', placeholder: '***********' }
	},
	authorize: async (credentials) => {
		if (PASSWORD === undefined || PASSWORD === null || PASSWORD === '' || PASSWORD.length < 8) {
			return null;
		}

		if (credentials?.password === PASSWORD) {
			return { id: 'admin', name: 'Admin' };
		}

		return null;
	}
});
