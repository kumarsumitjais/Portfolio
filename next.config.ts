import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Animated page changes via React <ViewTransition> + the browser View Transitions API
    viewTransition: true,
  },
};

export default nextConfig;
