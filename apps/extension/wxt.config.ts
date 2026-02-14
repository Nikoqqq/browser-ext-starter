import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  dev: {
    server: {
      port: 3200,
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  webExt: {
    disabled: true,
  },
  manifest: {
    name: "Browser Extension Starter",
    description: "Starter template with Convex real-time sync",
    permissions: ["storage"],
    host_permissions: ["<all_urls>"],
  },
});
