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
          source: "/_next/static/:path*",
          destination: `${PBS_ORIGIN}/_next/static/:path*`,
        },
        {
          source: "/_next/static/chunks/:path*",
          destination: `${PBS_ORIGIN}/_next/static/chunks/:path*`,
        },
        {
          source: "/_next/image",
          destination: `${PBS_ORIGIN}/_next/image`,
        },
        {
          source: "/puma/:path*",
          destination: `${PBS_ORIGIN}/puma/:path*`,
        },
        {
          source: "/sw.js",
          destination: `${PBS_ORIGIN}/sw.js`,
        },
      ],
    };
  },
};

export default nextConfig;
