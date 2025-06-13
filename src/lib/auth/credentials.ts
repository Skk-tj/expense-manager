import Credentials from '@auth/sveltekit/providers/credentials';

export const credentials = (thePassword: string) =>
	Credentials({
		credentials: {
			password: { label: 'Password', type: 'password', placeholder: '***********' }
		},
		authorize: async (credentials) => {
			if (
				thePassword === undefined ||
				thePassword === null ||
				thePassword === '' ||
				thePassword.length < 8
			) {
				return null;
			}

			if (credentials?.password === thePassword) {
				return { id: 'admin', name: 'Admin' };
			}

			return null;
		}
	});
