# Monorepo Structure

```
apps/
  extension/    @starter/extension   — WXT browser extension (Chrome, all URLs)
  web/          @starter/web         — Next.js + shadcn website
packages/
  backend/      @starter/backend     — Convex backend (schema, functions, generated types)
  shared/       @starter/shared      — Shared utils used by both apps
```

Bun workspaces link everything. Apps import Convex types via:

```ts
import { api } from "@starter/backend/convex/_generated/api";
```

## Commands

```bash
bun install                          # install all workspaces from root
bun run dev                          # run all three (backend + web + extension) in parallel

bun --filter @starter/backend dev    # convex dev (run first on fresh clone — interactive setup)
bun --filter @starter/web dev        # next.js dev server (port 3100)
bun --filter @starter/extension dev  # wxt dev (load apps/extension/.output/chrome-mv3 in chrome://extensions)

bun --filter @starter/web build      # production build web
bun --filter @starter/extension build  # production build extension
```

## Env Files

- `packages/backend/.env.local` — `CONVEX_DEPLOYMENT`, created by `convex dev` on first run (interactive)
- `apps/web/.env.local` — `NEXT_PUBLIC_CONVEX_URL`, needed by Next.js client
- `apps/extension/.env` — `VITE_CONVEX_URL`, used by WXT/Vite at build time

Run `bun run setup:env` after starting the backend to propagate the Convex URL to both apps automatically.

## Import Resolution

Both apps import Convex types via:

```ts
import { api } from "@starter/backend/convex/_generated/api";
```

The `_generated/` directory is created by `convex dev` and is not committed to git. Bundler resolve aliases in `wxt.config.ts` (Vite) and `next.config.ts` (Turbopack/Webpack) ensure imports resolve from the real source directory rather than through `node_modules` hardlinks.

## Loading the Extension

Load `apps/extension/.output/chrome-mv3/` as unpacked extension in `chrome://extensions` (enable Developer mode).

## Adding Convex Functions

Add `.ts` files in `packages/backend/convex/`. Both apps see them immediately through `@starter/backend`.
