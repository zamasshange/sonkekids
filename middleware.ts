import { NextRequest, NextResponse } from "next/server";

const PBS_ORIGIN = "https://pbskids.org";

const PBS_ASSET_PREFIXES = ["/_next/static/", "/puma/", "/sw.js"];

function shouldProxyToPbs(pathname: string) {
  return PBS_ASSET_PREFIXES.some((prefix) =>
    prefix.endsWith("/") ? pathname.startsWith(prefix) : pathname === prefix,
  );
}

async function proxyToPbs(request: NextRequest) {
  const target = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    PBS_ORIGIN,
  );

  const upstream = await fetch(target, {
    headers: {
      accept: request.headers.get("accept") ?? "*/*",
      referer: `${PBS_ORIGIN}/`,
    },
  });

  if (!upstream.ok) {
    return NextResponse.next();
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }
  headers.set("cache-control", "public, max-age=86400");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}

export async function middleware(request: NextRequest) {
  if (!shouldProxyToPbs(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return proxyToPbs(request);
}

export const config = {
  matcher: ["/_next/static/:path*", "/puma/:path*", "/sw.js"],
};
