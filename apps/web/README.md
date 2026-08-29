# Companion web app

The `@starter/web` workspace is the Next.js companion to the WXT extension.

Run it from the repository root:

```bash
bun run dev:web       # http://localhost:3100
bun run build:web
bun run lint
bun run typecheck:web
```

`/product` renders the shared Convex counter used by the extension demo. That route renders a clear configuration message when `NEXT_PUBLIC_CONVEX_URL` is missing, while the static splash remains available.

Styling uses Tailwind CSS 4's CSS-first configuration in `app/globals.css` with `@tailwindcss/postcss`. `components.json` intentionally leaves the legacy Tailwind config path empty.

Repository-wide setup, Convex environment routing, and release checks live in the root README.
