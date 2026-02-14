"use client";

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
            onClick={() => decrement({ name: "default" })}
          >
            -
          </Button>
          <span className="min-w-[3ch] text-center text-4xl font-bold tabular-nums">
            {counter?.value ?? 0}
          </span>
          <Button
            variant="outline"
            size="lg"
            onClick={() => increment({ name: "default" })}
          >
            +
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
