import type { NextConfig } from "next";
import path from "node:path";

const backendPath = path.resolve(__dirname, "../../packages/backend");

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@starter/backend": backendPath,
    },
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@starter/backend": backendPath,
    };
    return config;
  },
};

export default nextConfig;
