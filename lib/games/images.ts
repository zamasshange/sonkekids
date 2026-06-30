import type { GameImages, SonkeGame, WikipediaData } from "./types";
import { getCategoryAsset } from "./category-assets";
import { hashString } from "./hash";

export function buildGameImages(
  game: SonkeGame,
  wikipedia: WikipediaData | null,
): GameImages {
  const asset = getCategoryAsset(game.categoryId);
  const wikiImage = wikipedia?.imageUrl ?? wikipedia?.thumbnailUrl ?? null;
  const gradientBg = `linear-gradient(135deg, ${asset.gradient[0]}, ${asset.gradient[1]})`;

  return {
    banner: wikiImage,
    thumbnail: wikiImage ?? null,
    icon: asset.emoji,
    background: gradientBg,
    categoryImage: wikiImage,
    gallery: wikiImage ? [wikiImage] : [],
  };
}

export function getHeroVisual(game: SonkeGame, heroImage: string | null) {
  const asset = getCategoryAsset(game.categoryId);
  return {
    image: heroImage,
    emoji: asset.emoji,
    gradient: asset.gradient,
    accent: asset.accent,
    patternIndex: hashString(game.id) % 4,
  };
}
