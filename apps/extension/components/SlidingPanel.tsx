import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@starter/backend/convex/_generated/api";

export function SlidingPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl/Cmd + Shift + E to toggle
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "E") {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }
      // Escape to close
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, toggle]);

  return (
    <>
      {/* Toggle button - fixed to the right edge of the screen */}
      <button
        onClick={toggle}
        aria-label={isOpen ? "Close panel" : "Open panel"}
        aria-expanded={isOpen}
        aria-controls="starter-panel"
        className="fixed right-0 top-1/2 z-[2147483647] -translate-y-1/2 rounded-l-lg bg-primary px-1.5 py-3 text-white shadow-lg transition-all hover:bg-primary-hover hover:px-2.5"
        style={{ right: isOpen ? "380px" : "0px", transition: "right 0.3s ease" }}
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
        className="fixed right-0 top-0 z-[2147483646] h-screen w-[380px] overflow-y-auto border-l border-border bg-surface shadow-2xl"
        style={{
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
          <Counter />
        </div>
      </aside>
    </>
  );
}

function Counter() {
  const counter = useQuery(api.counter.get, { name: "default" });
  const increment = useMutation(api.counter.increment);
  const decrement = useMutation(api.counter.decrement);

  return (
    <div className="rounded-lg border border-border bg-surface-hover p-4 space-y-3">
      <h3 className="text-sm font-semibold text-text">Shared Counter</h3>
      <p className="text-xs text-text-muted">
        Synced in real-time with the web app via Convex
      </p>
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={() => decrement({ name: "default" })}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          -
        </button>
        <span className="min-w-[3ch] text-center text-2xl font-bold text-text tabular-nums">
          {counter?.value ?? 0}
        </span>
        <button
          onClick={() => increment({ name: "default" })}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          +
        </button>
      </div>
    </div>
  );
}
