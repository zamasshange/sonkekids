import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const PBS_ORIGIN = "https://pbskids.org";
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cms-assets.prod.pbskids.org", pathname: "/**" },
      { protocol: "https", hostname: "image.pbs.org", pathname: "/**" },
      { protocol: "https", hostname: "image.pbskids.org", pathname: "/**" },
      { protocol: "https", hostname: "*.pbskids.org", pathname: "/**" },
      { protocol: "https", hostname: "*.pbs.org", pathname: "/**" },
      { protocol: "https", hostname: "pbskids.org", pathname: "/**" },
    ],
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
