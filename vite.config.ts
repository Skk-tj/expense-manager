import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

function authSvelteKitCompat() {
	return {
		name: 'auth-sveltekit-compat',
		enforce: 'pre' as const,
		transform(code: string, id: string) {
			if (id.includes('@auth/sveltekit') && code.includes('import { base } from "$app/paths"')) {
				return {
					code: code.replace('import { base } from "$app/paths";', 'const base = "";'),
					map: null
				};
			}
		}
	};
}

export default defineConfig({
	plugins: [
		authSvelteKitCompat(),
		tailwindcss(),
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter({
				config: 'wrangler.jsonc',
				platformProxy: {
					configPath: 'wrangler.jsonc',
					persist: true
				}
			})
		})
	]
});
