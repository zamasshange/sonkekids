import { servePbsPage } from "@/lib/pbs-serve";
import { isGameDetailPath } from "@/lib/pbs-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESERVED = new Set(["games", "videos", "pbs-serve", "pbs-proxy", "pbs-assets", "_next"]);

type RouteContext = {
  params: Promise<{ show: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { show } = await context.params;
  if (RESERVED.has(show)) {
    return new Response("Not found", { status: 404 });
  }

  const pathname = `/${show}`;
  if (isGameDetailPath(`/games/${show}`)) {
    return new Response("Not found", { status: 404 });
  }

  const html = await servePbsPage(pathname);
  if (!html) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
