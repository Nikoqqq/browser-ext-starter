import ReactDOM from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { SlidingPanel } from "../components/SlidingPanel";
import "~/assets/global.css";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

function MissingConfig() {
  return (
    <div
      style={{
        padding: "1rem",
        fontFamily: "system-ui, sans-serif",
        fontSize: "13px",
      }}
    >
      <p style={{ color: "#dc2626", fontWeight: 600, marginBottom: "0.5rem" }}>
        Convex URL not configured
      </p>
      <p>
        Set <code>VITE_CONVEX_URL</code> in <code>apps/extension/.env</code>,
        then restart the dev server.
      </p>
    </div>
  );
}

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "starter-panel",
      position: "overlay",
      zIndex: 2147483647,
      onMount(container) {
        const root = ReactDOM.createRoot(container);
        if (convex) {
          root.render(
            <ConvexProvider client={convex}>
              <SlidingPanel />
            </ConvexProvider>
          );
        } else {
          root.render(<MissingConfig />);
        }
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
