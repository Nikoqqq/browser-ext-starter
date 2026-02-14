import ReactDOM from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { SlidingPanel } from "../components/SlidingPanel";
import "~/assets/global.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

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
        root.render(
          <ConvexProvider client={convex}>
            <SlidingPanel />
          </ConvexProvider>
        );
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
