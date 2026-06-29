import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { PBS_ASSET_MANIFEST } from "@/lib/pbs-asset-manifest";
import { resolveImageRequest } from "@/lib/pbs-image-resolve";

export const runtime = "nodejs";

const PBS_ORIGIN = "https://pbskids.org";

function contentType(path: string) {
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

export async function GET(request: NextRequest) {
  const localPath = resolveImageRequest(
    request.nextUrl.searchParams.get("url"),
    PBS_ASSET_MANIFEST,
  );

  if (localPath) {
    const diskPath = join(process.cwd(), "public", localPath.replace(/^\//, ""));
    if (existsSync(diskPath)) {
      const body = readFileSync(diskPath);
      return new NextResponse(body, {
        headers: {
          "content-type": contentType(diskPath),
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    }
  }

  const upstream = await fetch(
    `${PBS_ORIGIN}/_next/image${request.nextUrl.search}`,
    {
      headers: {
        referer: `${PBS_ORIGIN}/`,
      },
    },
  );

  if (!upstream.ok) {
    return new NextResponse("Image not found", { status: upstream.status });
  }

  const headers = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) {
    headers.set("content-type", upstreamType);
  }
  headers.set("cache-control", "public, max-age=86400");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
