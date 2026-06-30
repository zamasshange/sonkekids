import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GamePageView } from "@/components/game/GamePageView";
import { getGameById } from "@/lib/games/catalog";
import { getGamePageData } from "@/lib/games/enrich";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { getAllGameIds } = await import("@/lib/games/catalog");
  return getAllGameIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getGamePageData(slug);
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
  const game = getGameById(slug);
  if (!game) notFound();

  const data = await getGamePageData(slug);
  if (!data) notFound();

  return <GamePageView data={data} />;
}
