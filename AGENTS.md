# Repository Guidelines

## Project Structure & Module Organization
- `src/app` hosts the App Router entry points (`page.tsx`, route handlers, layouts) and global styles.
- `src/components` collects shared UI built with Panda CSS utilities; keep components focused and reusable.
- `src/lib` stores cross-cutting helpers (API clients, auth, transformers); prefer pure functions and typed exports.
- `public` contains static assets (icons, images) served directly by Next.js.
- `migrations` holds ordered SQL files that drive schema changes; use zero-padded prefixes (`0006_...`) to preserve execution order.
- `styled-system` is the generated Panda design token output; regenerate via `npm run prepare` when tokens change.

## Build, Test, and Development Commands
- `npm run dev` starts the Next.js dev server with hot reload for local feature work.
- `npm run lint` runs the ESLint configuration shipped with Next; resolve all warnings before raising a PR.
- `npm run build` produces the production build; pair it with `npm run start` if you need to smoke-test locally.
- `npm run pages:build` compiles through `@cloudflare/next-on-pages`; run this first when targeting Cloudflare Pages.
- `npm run preview` executes the Cloudflare-aware build and serves it via Wrangler to mimic the deployed edge runtime.
- `npm run deploy` publishes the Pages build; use only after a successful preview.
- `npm run cf-typegen` refreshes `env.d.ts` typing whenever bindings change.

## Coding Style & Naming Conventions
- TypeScript-first: favor `.tsx` for React views and `.ts` for logic; use named exports when possible.
- Indent with two spaces, keep imports sorted logically (React/Next, third-party, internal).
- Components and files follow PascalCase (`ClientLayout`), hooks and helpers use camelCase, SQL migrations remain snake_case.
- Leverage Panda tokens from `styled-system/css`; avoid hard-coded colors except documented brand values.
- Let ESLint guide formatting; if adding tooling, align configs with `eslint.config.mjs`.

## Testing Guidelines
- Automated tests are not yet wired in; add unit or integration coverage alongside new features (co-locate `.test.ts` files or create `src/__tests__`).
- Document manual verification steps in your PR so reviewers can reproduce them.
- Always run `npm run lint`, `npm run build`, and (when relevant) `npm run preview` before requesting review.
- Introduce new test scripts in `package.json` when adding tooling and describe how to invoke them in the PR.

## Commit & Pull Request Guidelines
- Follow the observed Conventional-style prefixes (`feat:`, `fix:`, `refactor:`) with concise, present-tense descriptions.
- Keep commits focused; separate schema/migration updates from UI or logic changes when practical.
- PRs should summarize scope, list breaking changes, note Cloudflare binding updates, and link related issues or tasks.
- Attach screenshots or short clips for UI-visible changes and include any required environment setup notes.

## Cloudflare & Configuration Notes
- `wrangler.toml` defines the Pages deployment; never commit secrets—use bindings instead.
- Update `next.config.ts` `setupDevBindings` and run `npm run cf-typegen` whenever you add bindings or KV namespaces.
- Keep Prisma or SQL changes in sync with migrations; run `pages:build` to confirm edge compatibility before deploys.
- Regenerate Panda artifacts (`npm run prepare`) after editing `panda.config.ts` to keep design tokens current.
