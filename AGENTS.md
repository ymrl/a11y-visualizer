# Repository Guidelines

## Communication
- Use English for all code, comments, and documentation.
- Use Japanese if you are asked and/or talked in Japanese. 日本語で話しかけられたり質問されたりした場合は日本語で答えてください。

## Development Process

- Use t-wada's TDD approach: write tests first, then implement the minimum code to pass the tests.
- Ensure all tests pass before committing or creating a pull request.
- Use feature branches for new features or bug fixes; merge into `main` via pull requests.
- Write clear commit messages in imperative mood (e.g., "Add feature X", "Fix bug Y").
- Review code for clarity, correctness, and adherence to guidelines before merging.

## Project Structure & Module Organization
- Root uses a pnpm workspace; main apps live in `apps/`.
- `apps/browser_extension/` — WXT + React TypeScript extension. Source in `src/`, entrypoints in `entrypoints/`, tests in `src/**/*.test.ts`. Build output in `dist/`.
- `apps/website/` — Astro + Tailwind static site. Pages in `src/pages/`, components in `src/components/`, public assets in `public/`.
- Shared configs: `eslint.config.js`, `biome.json`, `tsconfig*.json`, `tailwind.config.js`.

## Build, Test, and Development Commands
- Install: `pnpm install` (workspace-aware).
- Dev (extension): `pnpm dev` (Chromium) or `pnpm dev:firefox`.
- Dev (website): `pnpm dev:website` (serves on port 4000).
- Build (extension): `pnpm build` or `pnpm build:firefox`; zip for stores with `pnpm zip` / `pnpm zip:firefox`.
- Build (website): `pnpm build:website`.
- Test: `pnpm test` (runs Vitest browser tests via Playwright). First-time setup: `pnpm install-playwright`.
  - for codex: `pnpm test:jsdom` (runs Vitest in jsdom, it works in the sandbox of codex).
- Lint: `pnpm lint` (check) and `pnpm lint-fix` (auto-fix).

## Coding Style & Naming Conventions
- Languages: TypeScript, React (extension), Astro/TSX (website).
- Formatting: Prettier + Biome (2-space indent, double quotes via Biome). Run `pnpm lint-fix` before PRs.
- ESLint: TypeScript rules + React Hooks; `no-console` is enforced. Prefer explicit types and small, pure utilities.
- Naming: camelCase for variables/functions (`getKnownRole.ts`), PascalCase for React components, kebab-case directories under rules (`rules/heading-name/` with `index.ts` and `index.test.ts`).
- The file name should be same as the main exported function/class name.

## Testing Guidelines
- Framework: Vitest (browser mode) with Playwright (Chromium + Firefox).
- Location: co-locate tests next to sources, `*.test.ts`.
- Add tests for new rules/utilities and regressions; keep tests deterministic and DOM-focused.
- Run locally with `pnpm test` or `pnpm --filter @a11y-visualizer/browser-extension test:watch`.

### Testing in Codex (Playwright vs jsdom)
- Default in Codex: use `pnpm test:jsdom`.
  - Runs Vitest with jsdom using `apps/browser_extension/vite.test.jsdom.config.ts`.
  - No real browsers, no local server, fast and sandbox-friendly.
  - Some browser-only suites are excluded (e.g., target size, focusability) to keep runs deterministic.
- Use `pnpm test` only when you must validate real browser behavior.
  - Uses Playwright via `apps/browser_extension/vite.test.config.ts` (Chromium + Firefox, headless).
  - Prerequisites in Codex: run `pnpm install-playwright` once to download browsers; request elevated/approved run because Vitest opens a local server port.
  - If you see `EPERM: listen` errors, re-run with approval/elevated permissions.
- Quick commands
  - `pnpm test:jsdom` — safe default in Codex; verifies most logic and DOM rules.
  - `pnpm test` — full browser run; use when asserting layout/interaction specifics.

### CI (GitHub Actions)
- Pull Request checks run `pnpm test` and `pnpm lint` (see `.github/workflows/pr_lint.yml`).
- To reproduce CI locally or in Codex, run `pnpm test` with Playwright browsers installed:
  - `pnpm install` then `pnpm install-playwright`.
  - In Codex, approval/elevated run may be required due to local server binding.
- Tip before PR: run `pnpm lint-fix` to auto-fix style issues, then `pnpm lint` to verify clean status, which matches CI behavior.

## Commit & Pull Request Guidelines
- Commits: short, imperative English (e.g., "Fix heading level check"). Group related changes.
- PRs: include clear description, linked issues, and screenshots/GIFs for UI changes. Ensure `pnpm lint` and `pnpm test` pass. Update docs/translations when relevant.

## Notes for Agents & Contributors
- Prefer minimal, focused patches; follow existing folder patterns.
- Do not add secrets or store credentials; build artifacts are kept in `dist/` and zipped via scripts.
