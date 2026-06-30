import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GamePageView } from "@/components/game/GamePageView";
import { getAllGameIds, getGameById } from "@/lib/games/catalog";
import { getGamePageData } from "@/lib/games/enrich";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllGameIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameById(slug);
  if (!game) return { title: "Game | Sonke Kids" };

  return {
    title: `${game.title} | Sonke Kids Games`,
    description: `Play ${game.title}, a ${game.category} activity on Sonke Kids.`,
  };
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameById(slug);
  if (!game) notFound();

  const data = await getGamePageData(slug);
  if (!data) notFound();

  return <GamePageView data={data} />;
}
