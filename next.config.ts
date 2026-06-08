import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Strict mode catches common React bugs during dev
  reactStrictMode: true,

  // Only allow images from these domains if you add profile pics later
  images: {
    remotePatterns: [],
  },

  // Silence Mongoose model re-registration warnings in dev
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
