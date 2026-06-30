import { redirect, notFound } from "next/navigation";
import { resolveSonkeGameId } from "@/lib/games/resolve-slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string; id?: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const sonkeId = resolveSonkeGameId(slug);

  if (!sonkeId) {
    notFound();
  }

  redirect(`/games/${sonkeId}/play`);
}
