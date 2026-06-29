import { NextRequest, NextResponse } from "next/server";

const PBS_ORIGIN = "https://pbskids.org";

export const runtime = "nodejs";

async function proxyImageResponse(upstream: Response) {
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

export async function GET(request: NextRequest) {
  const pbsTarget = new URL(
    `/_next/image${request.nextUrl.search}`,
    PBS_ORIGIN,
  );

  const upstream = await fetch(pbsTarget, {
    headers: {
      accept: request.headers.get("accept") ?? "image/*",
    },
  });

  if (upstream.ok) {
    return proxyImageResponse(upstream);
  }

  const rawUrl = request.nextUrl.searchParams.get("url");
  if (rawUrl) {
    const direct = await fetch(decodeURIComponent(rawUrl), {
      headers: {
        accept: request.headers.get("accept") ?? "image/*",
      },
    });
    if (direct.ok) {
      return proxyImageResponse(direct);
    }
  }

  return new NextResponse("Image not found", { status: upstream.status || 404 });
}
