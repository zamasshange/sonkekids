import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const PBS_ORIGIN = "https://pbskids.org";
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/_next/static/css/:path*",
          destination: `${PBS_ORIGIN}/_next/static/css/:path*`,
        },
        {
          source: "/_next/static/media/:path*",
          destination: `${PBS_ORIGIN}/_next/static/media/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
