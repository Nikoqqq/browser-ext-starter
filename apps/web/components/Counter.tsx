"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@starter/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Counter() {
  const counter = useQuery(api.counter.get, { name: "default" });
  const increment = useMutation(api.counter.increment);
  const decrement = useMutation(api.counter.decrement);
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  async function updateCounter(direction: "increment" | "decrement") {
    setIsMutating(true);
    setMutationError(null);

    try {
      const mutate = direction === "increment" ? increment : decrement;
      await mutate({ name: "default" });
    } catch (error) {
      console.error(`Failed to ${direction} the shared counter`, error);
      setMutationError("Could not update the counter. Please try again.");
    } finally {
      setIsMutating(false);
    }
  }

  const isLoading = counter === undefined;
  const controlsDisabled = isLoading || isMutating;

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Shared Counter</CardTitle>
        <CardDescription>
          Synced in real-time with the browser extension via Convex
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() => void updateCounter("decrement")}
            disabled={controlsDisabled}
            aria-label="Decrement counter"
          >
            -
          </Button>
          <span
            aria-busy={isLoading}
            aria-label={isLoading ? "Loading counter" : "Counter value"}
            className="min-w-[3ch] text-center text-4xl font-bold tabular-nums"
          >
            {isLoading ? "…" : (counter?.value ?? 0)}
          </span>
          <Button
            variant="outline"
            size="lg"
            onClick={() => void updateCounter("increment")}
            disabled={controlsDisabled}
            aria-label="Increment counter"
          >
            +
          </Button>
        </div>
        {mutationError && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {mutationError}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
