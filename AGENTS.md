# AGENTS.md

This repository is a TanStack Start + Vite + React 19 app with TypeScript,
Tailwind CSS, content-collections, and Vitest.
Use this file as the canonical guide for agentic changes.

## Quick Commands (pnpm)

- Install deps: `pnpm install` or `pnpm in`
- Dev server: `pnpm dev` (Vite on port 1111)
- Build: `pnpm build` (content-collections build + Vite build + typecheck)
- Start prod: `pnpm start` (requires `pnpm build`)
- Build + start: `pnpm build:start`
- Typecheck: `pnpm check` (tsc --noEmit)
- Lint: `pnpm lint`
- Lint errors only: `pnpm lint:errors`
- Format: `pnpm format` (Prettier + Tailwind plugin)
- Analyze bundle: `pnpm analyze`
- Knip unused checks: `pnpm knip`

## Tests (Vitest)

- Run tests (watch): `pnpm test`
- Run tests once: `pnpm test -- --run`
- Watch mode: `pnpm test:watch`
- Coverage: `pnpm test:coverage`
- Single test file: `pnpm test -- --run src/client/lib/link.test.ts`
- Single test by name: `pnpm test -- --run -t "link utility"`
- Single test + file: `pnpm test -- --run src/client/lib/link.test.ts -t "link object"`

### Testing Notes

- Test files use `*.test.ts` or `*.test.tsx` naming.
- Place tests close to the code they cover when possible.
- Use Vitest globals (`describe`, `it`, `expect`) as in `src/client/lib/link.test.ts`.
- Prefer `--run` for CI-style single runs.

## Scripts & Utilities

- Content collections build: `pnpm build:cc`
- Search index build: `pnpm build:search-index`
- Check duplicate posts: `pnpm post:check-duplicates`
- Create a post: `pnpm post:create`
- Create a prompt: `pnpm prompt:create`
- Run any script: `pnpm scripts:run`
- Mastra dev: `pnpm mastra`

## Code Style Guidelines

### Language & Types

- TypeScript is `strict`; do not weaken compiler options.
- Prefer `type` aliases and inline `type` imports.
- Use `import { type Foo } from "..."` or `import { Bar, type Baz } from "..."`.
- Avoid `any`; use `unknown` and narrow with guards.
- Keep async functions typed with explicit return types for public APIs.
- Prefer `const` for values; use `let` only when reassignment is needed.
- Use `enum` sparingly; prefer unions or `as const` objects.

### Imports & Modules

- Favor path aliases (`~/...`) over deep relative paths.
- Use relative imports for same-folder modules (`./foo`, `../bar`).
- Group imports: external packages → internal aliases → relative.
- React 17+ JSX: do not add `import React` unless needed.

### React & Component Patterns

- Prefer function components with named exports (`export function Component()`).
- Use PascalCase for component names and types.
- Keep props typed inline or via `type Props` definitions.
- Keep JSX readable; avoid deeply nested ternaries.
- Use `Suspense` where async data is expected.

### Styling & UI

- Tailwind CSS is the primary styling system.
- Use the `cn` helper (`~/client/lib/utils`) for conditional class names.
- Let Prettier + Tailwind plugin reorder class lists.
- Keep `className` values as string literals when possible.

### Naming Conventions

- Files: follow existing conventions in each folder.
  - `src/client/components/**` largely uses `kebab-case` filenames.
  - Some top-level components use PascalCase (e.g., `NotFound.tsx`).
- Variables/functions: `camelCase`.
- Classes/components/types: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE` when truly constant.

### Error Handling

- Prefer explicit error boundaries and `try/catch` around I/O.
- In `catch`, treat the error as `unknown` and narrow safely.
- Add contextual messages (see `src/server/modules/search/build-search-index.script.ts`).
- Use `await-to-js` (`to()`) when returning `[error, result]` tuples is clearer.
- Avoid unhandled promises; await or `void` them intentionally.

### Linting Expectations (ESLint)

- `@typescript-eslint/consistent-type-imports` is enabled → use type-only imports.
- `@typescript-eslint/no-explicit-any` is a warning → avoid `any`.
- `@typescript-eslint/no-unsafe-*` and `no-floating-promises` are warnings.
- `@typescript-eslint/no-misused-promises` is enforced (async handlers OK for JSX).
- `react/prop-types` is disabled; TypeScript handles props.

### Formatting

- Prettier is configured with Tailwind plugin.
- Double quotes are enforced by Prettier config.
- Run `pnpm format` for deterministic formatting.

## Project Structure Notes

- Routes are file-based in `src/app` (TanStack Start conventions).
- Generated files to avoid editing directly:
  - `src/routeTree.gen.ts`
  - `.content-collections/**`
  - `.output/**`, `.tanstack/**`, `.nitro/**`, `dist/**`
- Content collections build output is used by the app; run `pnpm build` or `pnpm build:cc` when needed.

### Directory Layout

- `src/app`: TanStack Start route files (`__root.tsx`, `index.tsx`, etc.).
- `src/client`: client UI components, hooks, and utilities.
- `src/server`: server modules, scripts, and infra.
- `src/common`: shared types, constants, and scripts.
- `src/content`: content posts and interactive embeds.
- `src/styles`: Tailwind and global CSS.
- `src/svg`: inline SVG assets.

### Routing & Data

- Prefer `createFileRoute` + `createServerFn` patterns in routes.
- Use React Query for client data fetching and caching.
- Keep server helpers in `src/server` and import via `~/server/...`.

## Cursor/Copilot Rules

- No `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` found in this repo.

## When In Doubt

- Follow existing patterns in the nearest file.
- Keep changes minimal and focused.
- Prefer readability over cleverness.
- Update tests when changing behavior.
