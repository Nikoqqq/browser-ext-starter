"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (!convex) {
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h2 style={{ color: "#dc2626", marginBottom: "1rem" }}>
          Convex URL not configured
        </h2>
        <p style={{ marginBottom: "0.5rem" }}>
          Set <code>NEXT_PUBLIC_CONVEX_URL</code> in{" "}
          <code>apps/web/.env.local</code>:
        </p>
        <pre
          style={{
            background: "#f3f4f6",
            padding: "1rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
{`# 1. Start the backend first:
bun run dev:backend

# 2. Then propagate the env:
bun run setup:env`}
        </pre>
      </div>
    );
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
