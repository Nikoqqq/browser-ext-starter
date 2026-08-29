# Convex backend

This directory contains the shared backend for the web app and browser extension.

- `schema.ts` defines the data model and indexes.
- `counter.ts` is the intentionally small real-time demo.
- `_generated/` contains committed API and data-model types.
- `_generated/ai/guidelines.md` contains the current Convex authoring rules installed by `convex ai-files`.

Run Convex commands from the repository root:

```bash
bun run dev:backend
bun run codegen
bun run typecheck:backend
bunx convex ai-files status
```

The demo counter is public and unauthenticated so a freshly created starter can prove web/extension synchronization. Before adapting it to real user data, enforce identity and object ownership inside every public query and mutation.

Generated files should not be edited by hand. Change the schema or functions, run codegen, and commit the resulting generated API.
