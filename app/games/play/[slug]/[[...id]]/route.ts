import { readFileSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";
import { getCachedPlayHtmlPath, getPlayEntryByPbsSlug } from "@/lib/games/play-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string; id?: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug, id } = await context.params;
  const pbsId = id?.[0];
  const entry = getPlayEntryByPbsSlug(slug);

  if (!entry) {
    notFound();
  }

  const htmlPath = getCachedPlayHtmlPath(slug, pbsId);
  if (!htmlPath) {
    notFound();
  }

  const html = readFileSync(htmlPath, "utf-8");

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
