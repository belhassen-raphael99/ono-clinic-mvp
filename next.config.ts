import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lock Turbopack to this project as the workspace root.
  // Without this, a stray lockfile higher in the filesystem can be
  // misdetected as the workspace root and cause path resolution warnings.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
