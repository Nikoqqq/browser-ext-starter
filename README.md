# Browser Extension Starter

A production-minded starter for a browser extension and companion web app with shared, real-time state.

**Stack:** Bun workspaces · WXT 0.21 · React 19 · Tailwind CSS 4 · Convex · Next.js 16 · shadcn/ui

## Prerequisites

- [Bun](https://bun.sh/) 1.4.0 or newer
- [Node.js](https://nodejs.org/) 22.12.0 or newer
- A Convex account for a cloud deployment, or Convex anonymous local mode for account-free development

The exact Bun release is recorded in `packageManager`; CI uses that version with the committed lockfile.

## Quick start

```bash
# Install every workspace from the repository root.
bun install --frozen-lockfile

# Configure and start Convex. Stop it after "Convex functions ready!".
bun run dev:backend

# Copy the generated Convex URL into both app-specific env files.
bun run setup:env

# Start Convex, Next.js, and WXT together.
bun run dev
```

For a disposable, account-free local backend, run the setup step as:

```bash
CONVEX_AGENT_MODE=anonymous bun run dev:backend
```

Convex owns the root `.env.local`; `setup:env` writes only the two public client URLs:

- `apps/web/.env.local` → `NEXT_PUBLIC_CONVEX_URL`
- `apps/extension/.env` → `VITE_CONVEX_URL`

## Load the extension

1. Run `bun run build:ext`.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Choose **Load unpacked** and select `apps/extension/.output/chrome-mv3/`.

The content script currently matches all URLs because the starter demonstrates a site-overlay extension. Narrow `matches` before shipping a product that only needs specific sites.

## Project structure

```text
apps/
  extension/    @starter/extension   WXT extension (Chrome and Firefox)
  web/          @starter/web         Next.js companion app (port 3100)
packages/
  backend/      @starter/backend     Convex schema, functions, and generated API
  shared/       @starter/shared      Optional home for future cross-app utilities
```

Both apps import the generated Convex API directly from `@starter/backend`. The demo shared counter proves end-to-end subscriptions: open `/product` in the web app and the extension panel, then change either counter.

The counter functions are intentionally public and unauthenticated demo endpoints. Add authorization and ownership checks before storing real user data.

## Quality gates

| Command | Purpose |
| --- | --- |
| `bun run lint` | Lint the Next.js app with the flat ESLint config |
| `bun run typecheck` | Type-check root scripts plus backend, web, and extension workspaces |
| `bun run build` | Build the web app and Chrome extension |
| `bun run build:ext:firefox` | Build the Firefox extension |
| `bun run check` | Run lint, all type-checks, both browser builds, and high-severity audit |
| `bun run check:release-env` | Reject a missing, local, or malformed production Convex URL |
| `bun run check:release` | Validate the release URL, run `check`, and produce Chrome/Firefox ZIP artifacts |
| `bun run audit` | Fail on high or critical advisories |
| `bun run audit:all` | Report advisories at every severity |
| `bun run codegen` | Refresh committed Convex generated files |

Generated Convex API files are committed so a clean checkout can type-check and build without an active deployment. Run `bun run codegen` after changing the schema or functions.

## Convex AI guidance

The repository uses Convex AI files for current backend rules and editor/agent skills:

```bash
bunx convex ai-files status
bunx convex ai-files update
```

This installs guidance for Codex and Claude Code. It does **not** install the optional `@convex-dev/agent` runtime component; add that only when the product actually needs persistent AI-agent threads, tools, or workflows.

## Before publishing a derived extension

- Set the production Convex URL explicitly, then build the store artifacts:

  ```bash
  VITE_CONVEX_URL=https://<production-deployment>.convex.cloud bun run check:release
  ```

  Alternatively, put the same value in the gitignored `apps/extension/.env.production.local`. The release preflight deliberately ignores the development-only `apps/extension/.env`, so a localhost or dev deployment cannot silently enter a store ZIP.
- Narrow the content-script matches to the sites the product actually supports.
- Add product-specific icons, name, description, privacy disclosures, and store metadata.
- Configure a stable Firefox extension ID and the required data-collection declaration.
- Replace the public demo counter with authenticated, ownership-checked functions.
- Inspect both generated manifests and archives. The Firefox sources ZIP contains the root lockfile, extension sources, and imported Convex backend files needed to reproduce the extension bundle; it excludes environment and agent files.

## Dependency policy

Dependencies are kept at the newest versions compatible with the current toolchain. The web workspace deliberately stays on ESLint 9 and TypeScript 5.9 until the Next.js ESLint stack supports their next majors. Node types target the documented Node 22 runtime floor instead of an unrelated newer Node major.

See [`docs/monorepo.md`](docs/monorepo.md) for workspace and environment details.
