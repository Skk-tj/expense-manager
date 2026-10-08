/// <reference path="../worker-configuration.d.ts" />
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface Env {
		AUTH_SECRET?: string;
		PASSWORD?: string;
		API_KEY?: string;
		SHORTCUTS_API_KEY?: string;
	}
	namespace Cloudflare {
		interface Env {
			AUTH_SECRET?: string;
			PASSWORD?: string;
			API_KEY?: string;
			SHORTCUTS_API_KEY?: string;
		}
	}
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
