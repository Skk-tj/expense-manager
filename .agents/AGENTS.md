# Technology Stack & Guidelines

1. **SvelteKit & Svelte 5**
   - Use Svelte 5 syntax.
   - Do not use Svelte 4.

2. **Skeleton UI v5 & Tailwind CSS v4**
   - Use Skeleton v5 for UI components.
   - Uses Tailwind CSS v4.

3. **Database & ORM**
   - The project uses **Drizzle ORM** with **libSQL / Cloudflare D1**.
   - Always run `pnpm run db:generate` or `pnpm run db:migrate` if schema changes are made.
   - Schemas are defined in `drizzle/` and managed through `drizzle-kit`.

4. **Package Manager & Commands**
   - **pnpm** is the designated package manager. Always use `pnpm` instead of `npm` or `yarn` (e.g., `pnpm add`, `pnpm run build`).
   - For formatting code, run `pnpm run format` (uses `oxfmt`).
   - For type checking, run `pnpm run check`.
   - For development server, run `pnpm run dev`.

5. **Cloudflare Workers**
   - The project targets Cloudflare (via `@sveltejs/adapter-cloudflare` and `wrangler.jsonc`).
   - Avoid Node.js-specific APIs (`fs`, `path`, etc.) in server-side logic unless properly shimmed or executed at build time. Use standard web APIs compatible with Cloudflare Workers.
