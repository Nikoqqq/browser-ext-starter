import path from "node:path";
import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  zip: {
    // Firefox reviewers need enough of the monorepo to reproduce the bundle.
    // Keep this an explicit allowlist so local env and agent files never leak.
    sourcesRoot: path.resolve(__dirname, "../.."),
    includeSources: [
      "README.md",
      "package.json",
      "bun.lock",
      "tsconfig.json",
      "convex.json",
      "apps/extension/**",
      "apps/web/package.json",
      "packages/backend/**",
      "packages/shared/**",
    ],
    excludeSources: [
      "**/.env*",
      "apps/extension/.output/**",
      "apps/extension/.wxt/**",
      "packages/backend/convex/_generated/ai/**",
    ],
  },
  dev: {
    server: {
      port: 3200,
    },
  },
  webExt: {
    disabled: true,
  },
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@starter/backend": path.resolve(__dirname, "../../packages/backend"),
      },
    },
  }),
  manifest: {
    name: "Browser Extension Starter",
    description: "Starter template with Convex real-time sync",
  },
});
