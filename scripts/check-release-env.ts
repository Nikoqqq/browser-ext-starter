/**
 * Refuses to create store artifacts unless the extension has an explicit,
 * non-local production Convex URL. Vite gives process env the highest priority,
 * followed by mode-specific env files.
 */

import { existsSync, readFileSync } from "node:fs";
import { isIP } from "node:net";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const extensionRoot = resolve(root, "apps/extension");

function readEnvVar(filePath: string, varName: string): string | null {
  if (!existsSync(filePath)) return null;

  for (const line of readFileSync(filePath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const [key, ...rest] = trimmed.split("=");
    if (key.trim() === varName) {
      const value = rest.join("=").trim();
      const quote = value[0];
      if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
        return value.slice(1, -1);
      }
      return value;
    }
  }

  return null;
}

const candidates = [
  { source: "process environment", value: process.env.VITE_CONVEX_URL ?? null },
  {
    source: "apps/extension/.env.production.local",
    value: readEnvVar(
      resolve(extensionRoot, ".env.production.local"),
      "VITE_CONVEX_URL",
    ),
  },
  {
    source: "apps/extension/.env.production",
    value: readEnvVar(
      resolve(extensionRoot, ".env.production"),
      "VITE_CONVEX_URL",
    ),
  },
];

const configured = candidates.find(({ value }) => value);

if (!configured?.value) {
  console.error(
    "Release blocked: no explicit production VITE_CONVEX_URL was found.\n\n" +
      "Set it for this command:\n" +
      "  VITE_CONVEX_URL=https://<production-deployment>.convex.cloud bun run check:release\n\n" +
      "Or save it in apps/extension/.env.production.local (gitignored).",
  );
  process.exit(1);
}

let url: URL;
try {
  url = new URL(configured.value);
} catch {
  console.error(`Release blocked: ${configured.source} contains an invalid URL.`);
  process.exit(1);
}

const hostname = url.hostname.toLowerCase();
const unwrappedHostname = hostname.replace(/^\[|\]$/g, "");
const isLocal =
  hostname === "localhost" ||
  hostname.endsWith(".localhost") ||
  hostname.endsWith(".local") ||
  hostname.endsWith(".internal") ||
  isIP(unwrappedHostname) !== 0;
const isReserved =
  hostname === "example.com" ||
  hostname === "example.net" ||
  hostname === "example.org" ||
  hostname.endsWith(".example") ||
  hostname.endsWith(".invalid") ||
  hostname.endsWith(".test");
const hasUnexpectedParts =
  url.username !== "" ||
  url.password !== "" ||
  url.port !== "" ||
  (url.pathname !== "" && url.pathname !== "/") ||
  url.search !== "" ||
  url.hash !== "";

if (
  url.protocol !== "https:" ||
  isLocal ||
  isReserved ||
  !hostname.includes(".") ||
  hasUnexpectedParts
) {
  console.error(
    `Release blocked: ${configured.source} must contain a clean, public HTTPS Convex origin.`,
  );
  process.exit(1);
}

console.log(`Release Convex URL preflight passed (${configured.source}).`);
