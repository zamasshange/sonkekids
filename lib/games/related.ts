import { loadCatalog } from "./catalog";
import type { RelatedContentItem, SonkeGame } from "./types";
import { hashString } from "./hash";

function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 2),
  );
}

function scoreRelatedness(source: SonkeGame, candidate: SonkeGame): number {
  if (source.id === candidate.id) return -1;

  let score = 0;
  const sourceTokens = titleTokens(source.title);
  const candidateTokens = titleTokens(candidate.title);

  for (const token of candidateTokens) {
    if (sourceTokens.has(token)) score += 3;
  }

  if (candidate.categoryId === source.categoryId) score += 2;

  score += (hashString(`${source.id}-${candidate.id}`) % 3) * 0.1;
  return score;
}

export function getSuggestedGames(game: SonkeGame, limit = 6): SonkeGame[] {
  return loadCatalog()
    .games.filter((item) => item.id !== game.id)
    .map((item) => ({ item, score: scoreRelatedness(game, item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function buildRelatedContent(game: SonkeGame): RelatedContentItem[] {
  const topic = game.title.split(" ")[0];
  return [
    {
      type: "video",
      title: `${topic} Adventures`,
      href: "/videos",
      description: `Watch fun ${game.category.toLowerCase()} videos on Sonke Kids.`,
    },
    {
      type: "activity",
      title: `${game.title} Challenge`,
      href: `#play-${game.id}`,
      description: "Try a bonus round after you finish playing.",
    },
    {
      type: "quiz",
      title: `${topic} Quiz`,
      href: `#quiz-${game.id}`,
      description: "Test what you learned with a quick quiz.",
    },
    {
      type: "collection",
      title: `More ${game.category}`,
      href: "/games/browse",
      description: `Explore the full ${game.category} collection.`,
    },
    {
      type: "article",
      title: `Why Kids Love ${game.title}`,
      href: `#discover-${game.id}`,
      description: "Read about the skills this game builds.",
    },
  ];
}
