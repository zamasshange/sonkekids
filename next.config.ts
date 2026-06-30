import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const PBS_ORIGIN = "https://pbskids.org";
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  outputFileTracingExcludes: {
    "*": ["./public/pbs-assets/**"],
  },
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/pbs-proxy/:path*",
          destination: `${PBS_ORIGIN}/:path*`,
        },
        // PBS clone HTML references these paths — never proxy /_next/static/chunks (our app bundles).
        {
          source: "/_next/static/css/:path*",
          destination: `${PBS_ORIGIN}/_next/static/css/:path*`,
        },
        {
          source: "/_next/static/media/:path*",
          destination: `${PBS_ORIGIN}/_next/static/media/:path*`,
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
