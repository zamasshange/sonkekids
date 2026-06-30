import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getGameById } from "@/lib/games/catalog";
import { getGamePageData } from "@/lib/games/enrich";
import { resolveSonkeGameId, getDefaultGameId, getAllPlayableSlugs } from "@/lib/games/resolve-slug";
import { SonkePlayShell } from "@/components/game/SonkePlayShell";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

function resolveGameId(slug: string): string | null {
  const mapped = resolveSonkeGameId(slug);
  if (mapped && getGameById(mapped)) return mapped;
  if (getGameById(slug)) return slug;
  return null;
}

export async function generateStaticParams() {
  return getAllPlayableSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const gameId = resolveGameId(slug);
  if (!gameId) return { title: "Play | Sonke Kids" };
  const data = await getGamePageData(gameId);
  if (!data) return { title: "Play | Sonke Kids" };
  return {
    title: `Play ${data.game.title} | Sonke Kids`,
    description: data.ai.tagline,
  };
}

export default async function GamePlayPage({ params }: PageProps) {
  const { slug } = await params;
  const gameId = resolveGameId(slug) ?? getDefaultGameId();

  const data = await getGamePageData(gameId);
  if (!data) redirect(`/games/${getDefaultGameId()}/play`);

  return <SonkePlayShell data={data} />;
}
