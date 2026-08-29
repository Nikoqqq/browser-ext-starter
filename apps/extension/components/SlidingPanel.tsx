import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@starter/backend/convex/_generated/api";

export function SlidingPanel({ children }: { children?: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelWidth = "min(380px, calc(100vw - 2.5rem))";

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Toggle button - fixed to the right edge of the screen */}
      <button
        onClick={toggle}
        aria-label={isOpen ? "Close panel" : "Open panel"}
        aria-expanded={isOpen}
        aria-controls="starter-panel"
        className="fixed right-0 top-1/2 z-[2147483647] -translate-y-1/2 rounded-l-lg bg-primary px-1.5 py-3 text-white shadow-lg transition-all hover:bg-primary-hover hover:px-2.5"
        style={{
          right: isOpen ? panelWidth : "0px",
          transition: "right 0.3s ease",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Sliding panel */}
      <aside
        id="starter-panel"
        role="complementary"
        aria-label="Extension panel"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className="fixed right-0 top-0 z-[2147483646] h-screen overflow-y-auto border-l border-border bg-surface shadow-2xl"
        style={{
          width: panelWidth,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-semibold text-text">Extension Panel</h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close panel"
            className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Panel content */}
        <div className="p-4 space-y-4">
          {isOpen && (children ?? <Counter />)}
        </div>
      </aside>
    </>
  );
}

function Counter() {
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
    <div className="rounded-lg border border-border bg-surface-hover p-4 space-y-3">
      <h3 className="text-sm font-semibold text-text">Shared Counter</h3>
      <p className="text-xs text-text-muted">
        Synced in real-time with the web app via Convex
      </p>
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={() => void updateCounter("decrement")}
          disabled={controlsDisabled}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          -
        </button>
        <span
          aria-busy={isLoading}
          aria-label={isLoading ? "Loading counter" : undefined}
          className="min-w-[3ch] text-center text-2xl font-bold text-text tabular-nums"
        >
          {isLoading ? "…" : (counter?.value ?? 0)}
        </span>
        <button
          onClick={() => void updateCounter("increment")}
          disabled={controlsDisabled}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          +
        </button>
      </div>
      {mutationError && (
        <p role="alert" className="text-xs text-red-600">
          {mutationError}
        </p>
      )}
    </div>
  );
}
