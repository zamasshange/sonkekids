import { servePbsPage } from "@/lib/pbs-serve";
import { getGameById } from "@/lib/games/catalog";
import { resolveSonkeGameId } from "@/lib/games/resolve-slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

function isSonkeGameSlug(slug: string): boolean {
  const resolved = resolveSonkeGameId(slug) ?? slug;
  return Boolean(getGameById(resolved));
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (isSonkeGameSlug(slug)) {
    return new Response("Not found", { status: 404 });
  }

  const pathname = `/games/${slug}`;
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
