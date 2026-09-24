import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@workspace/db"],
  images: { unoptimized: true },
};

export default nextConfig;