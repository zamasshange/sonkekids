import { servePbsPage } from "@/lib/pbs-serve";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path");
  if (!path || !path.startsWith("/")) {
    return new Response("Missing path", { status: 400 });
  }

  const html = await servePbsPage(path);
  if (!html) {
    return new Response("Page not found", { status: 404 });
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
