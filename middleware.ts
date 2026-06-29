import { NextRequest, NextResponse } from "next/server";

const PBS_ORIGIN = "https://pbskids.org";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/_next/image") {
    return NextResponse.next();
  }

  const target = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    PBS_ORIGIN,
  );

  const upstream = await fetch(target, {
    headers: {
      accept: request.headers.get("accept") ?? "image/*,*/*",
    },
  });

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

export const config = {
  matcher: "/_next/image",
};
