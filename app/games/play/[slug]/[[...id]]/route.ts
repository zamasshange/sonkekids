import { readFileSync } from "fs";
import { redirect, notFound } from "next/navigation";
import {
  getCachedPlayHtmlPath,
  getPlayEntryByPbsSlug,
} from "@/lib/games/play-url";
import { resolveSonkeGameId } from "@/lib/games/resolve-slug";
import { servePbsPage } from "@/lib/pbs-serve";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string; id?: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug, id } = await context.params;
  const pbsId = id?.[0];

  const htmlPath = getCachedPlayHtmlPath(slug, pbsId);
  if (htmlPath) {
    const html = readFileSync(htmlPath, "utf-8");
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const sonkeId = resolveSonkeGameId(slug);
  if (sonkeId) {
    redirect(`/games/${sonkeId}`);
  }

  const entry = getPlayEntryByPbsSlug(slug);
  if (entry) {
    const livePath = `/games/play/${slug}/${pbsId ?? entry.pbsId}`;
    const html = await servePbsPage(livePath);
    if (html) {
      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=600",
        },
      });
    }
  }

  notFound();
}
