# Monorepo guide

## Workspace layout

```text
apps/
  extension/    @starter/extension   WXT extension for Chrome and Firefox
  web/          @starter/web         Next.js companion app
packages/
  backend/      @starter/backend     Convex functions and generated types
  shared/       @starter/shared      Optional cross-app utilities
```

Bun workspaces link local packages. The two clients share Convex types through:

```ts
import { api } from "@starter/backend/convex/_generated/api";
```

`packages/shared` is intentionally not an app dependency until it exports something used by both clients.

## Convex project root

The repository root is the canonical Convex CLI working directory. Root `convex.json` points at `packages/backend/convex`, and root `.env.local` stores the selected local or cloud deployment.

```bash
bun run dev:backend   # interactive cloud/local setup in a terminal
bun run codegen       # regenerate types against the configured deployment
```

For a non-interactive, account-free local backend:

```bash
CONVEX_AGENT_MODE=anonymous bun run dev:backend
```

The files under `packages/backend/convex/_generated/` are generated but committed. Keeping them in Git lets fresh checkouts type-check and build before a developer selects a deployment.

## Environment routing

| File | Owner | Client variable |
| --- | --- | --- |
| `.env.local` | Convex CLI | `CONVEX_DEPLOYMENT` and/or `CONVEX_URL` |
| `apps/web/.env.local` | setup script | `NEXT_PUBLIC_CONVEX_URL` |
| `apps/extension/.env` | setup script | `VITE_CONVEX_URL` |
| `apps/extension/.env.production.local` | release owner | production `VITE_CONVEX_URL` |

After selecting a Convex deployment, run `bun run setup:env`. The script preserves unrelated variables and upserts only the public Convex URL used by each client.

Do not commit any of these env files. `.env.example` documents the root shape without containing a real deployment.

Release builds require an explicit production URL through `VITE_CONVEX_URL` or the gitignored `apps/extension/.env.production.local`. `bun run check:release` deliberately ignores the development `.env` during preflight and rejects missing, local, or malformed release origins.

## Commands

```bash
bun install --frozen-lockfile
bun run dev

bun run lint
bun run typecheck
bun run build
bun run build:ext:firefox
bun run check
bun run check:release
```

WXT writes unpacked builds to `apps/extension/.output/chrome-mv3/` and `apps/extension/.output/firefox-mv2/`, with release archives in `apps/extension/.output/`. These outputs are ignored and must be regenerated before they are treated as evidence.

## Convex AI files

Root `convex.json` enables AI files for Codex and Claude Code. The generated `AGENTS.md`, `CLAUDE.md`, backend guidelines, skills, and `skills-lock.json` are committed so contributors get the same current rules.

```bash
bunx convex ai-files status
bunx convex ai-files update
```

AI files are development guidance. They are separate from the optional `@convex-dev/agent` runtime component.

## Adding backend functionality

1. Update the schema and functions in `packages/backend/convex/`.
2. Use validators for arguments and return values.
3. Prefer indexed queries over in-memory filtering.
4. Add authorization before exposing user-specific or sensitive data.
5. Run `bun run codegen` and commit the refreshed `_generated` files.
6. Run `bun run check` from the repository root.
