import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GamePageView } from "@/components/game/GamePageView";
import { getGameById } from "@/lib/games/catalog";
import { getGamePageData } from "@/lib/games/enrich";
import { resolveSonkeGameId } from "@/lib/games/resolve-slug";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function resolveGameId(slug: string): string | null {
  const mapped = resolveSonkeGameId(slug);
  if (mapped && getGameById(mapped)) return mapped;
  if (getGameById(slug)) return slug;
  return null;
}

export async function generateStaticParams() {
  const { getAllGameIds } = await import("@/lib/games/catalog");
  return getAllGameIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const gameId = resolveGameId(slug);
  if (!gameId) return { title: "Game | Sonke Kids" };

  const data = await getGamePageData(gameId);
  if (!data) return { title: "Game | Sonke Kids" };

  const { seo, heroImage } = data;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: heroImage ? [{ url: heroImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: heroImage ? "summary_large_image" : "summary",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: heroImage ? [heroImage] : undefined,
    },
  };
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const gameId = resolveGameId(slug);
  if (!gameId) notFound();

  const data = await getGamePageData(gameId);
  if (!data) notFound();

  return <GamePageView data={data} />;
}
