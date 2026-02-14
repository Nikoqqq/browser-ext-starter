/**
 * Propagates the Convex deployment URL from the backend package
 * to both app env files.
 *
 * Usage: bun run scripts/setup-env.ts
 *
 * Reads:  packages/backend/.env.local  (CONVEX_URL or CONVEX_DEPLOYMENT)
 * Writes: apps/web/.env.local          (NEXT_PUBLIC_CONVEX_URL=...)
 *         apps/extension/.env          (VITE_CONVEX_URL=...)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

const BACKEND_ENV = resolve(ROOT, "packages/backend/.env.local");
const WEB_ENV = resolve(ROOT, "apps/web/.env.local");
const EXT_ENV = resolve(ROOT, "apps/extension/.env");

function readEnvVar(filePath: string, varName: string): string | null {
  if (!existsSync(filePath)) return null;
  const content = readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key.trim() === varName) return rest.join("=").trim();
  }
  return null;
}

function upsertEnvVar(filePath: string, varName: string, value: string): void {
  let content = existsSync(filePath)
    ? readFileSync(filePath, "utf-8")
    : "";

  const lines = content.split("\n");
  let found = false;

  const updated = lines.map((line) => {
    if (!line.trim().startsWith("#") && line.trim().startsWith(varName + "=")) {
      found = true;
      return `${varName}=${value}`;
    }
    return line;
  });

  if (!found) updated.push(`${varName}=${value}`);

  writeFileSync(filePath, updated.join("\n").replace(/\n+$/, "") + "\n");
}

// --- Main ---

let convexUrl = readEnvVar(BACKEND_ENV, "CONVEX_URL");

if (!convexUrl) {
  const deployment = readEnvVar(BACKEND_ENV, "CONVEX_DEPLOYMENT");
  if (deployment) {
    const slug = deployment.replace(/^dev:/, "");
    convexUrl = `https://${slug}.convex.cloud`;
    console.log(`Derived URL from CONVEX_DEPLOYMENT: ${convexUrl}`);
  }
}

if (!convexUrl) {
  console.error(
    "Error: Could not find CONVEX_URL or CONVEX_DEPLOYMENT in packages/backend/.env.local\n\n" +
      "Run 'bun run dev:backend' first to set up your Convex deployment.\n"
  );
  process.exit(1);
}

console.log(`Convex URL: ${convexUrl}\n`);

upsertEnvVar(WEB_ENV, "NEXT_PUBLIC_CONVEX_URL", convexUrl);
console.log("  Updated apps/web/.env.local");

upsertEnvVar(EXT_ENV, "VITE_CONVEX_URL", convexUrl);
console.log("  Updated apps/extension/.env");

console.log("\nDone! Both apps are now configured.");
