import type { NextConfig } from "next";

const PBS_ORIGIN = "https://pbskids.org";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/_next/:path*",
        destination: `${PBS_ORIGIN}/_next/:path*`,
      },
      {
        source: "/puma/:path*",
        destination: `${PBS_ORIGIN}/puma/:path*`,
      },
      {
        source: "/sw.js",
        destination: `${PBS_ORIGIN}/sw.js`,
      },
    ];
  },
};

export default nextConfig;
