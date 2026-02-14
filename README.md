# Browser Extension Starter

A starter template for building Chrome extensions with companion websites, powered by real-time sync.

**Stack:** Bun workspaces · WXT (Shadow DOM) · React · Tailwind CSS · Convex · Next.js · shadcn/ui

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.1+)
- [Node.js](https://nodejs.org/) (v18+)
- A free [Convex](https://convex.dev/) account

### Setup

```bash
# 1. Install dependencies
bun install

# 2. Start the Convex backend (interactive — creates your deployment)
bun run dev:backend
# Wait for "Convex functions ready!", then press Ctrl+C

# 3. Propagate the Convex URL to both apps
bun run setup:env

# 4. Start everything (backend + web + extension)
bun run dev
```

### Load the Extension

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select `apps/extension/.output/chrome-mv3/`

## Project Structure

```
apps/
  extension/    @starter/extension   — WXT browser extension (Chrome)
  web/          @starter/web         — Next.js + shadcn website (port 3100)
packages/
  backend/      @starter/backend     — Convex backend (schema + functions)
  shared/       @starter/shared      — Shared utilities
```

## How It Works

Both apps connect to the same Convex backend. The demo feature is a **shared counter**:

- The extension injects a sliding panel (Shadow DOM) on any page with +/- buttons
- The web app at `localhost:3100/product` shows the same counter
- Changes sync in real-time via Convex subscriptions

This proves the end-to-end architecture works. Replace the counter with your own features.

## Architecture Notes

- **Shadow DOM isolation** — The extension's UI is fully isolated from host page styles using WXT's `createShadowRootUi` + Tailwind v4
- **Convex real-time** — Both apps use `useQuery` subscriptions, so changes propagate instantly
- **Bun workspaces** — Shared types via `@starter/backend` package; both apps import `api` from the same source
- **Keyboard shortcut** — `Ctrl/Cmd + Shift + E` toggles the extension panel, `Escape` closes it

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all services in parallel |
| `bun run dev:backend` | Convex dev server only |
| `bun run dev:web` | Next.js dev server only (port 3100) |
| `bun run dev:ext` | WXT dev server only (port 3200) |
| `bun run build:web` | Production build for web |
| `bun run build:ext` | Production build for extension |
| `bun run setup:env` | Propagate Convex URL to app env files |
