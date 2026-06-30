import { loadCatalog } from "./catalog";
import type { SearchResult, SonkeGame } from "./types";
import { buildFunFacts } from "./topic-facts";

function gameToSearchResults(game: SonkeGame): SearchResult[] {
  const funFacts = buildFunFacts(game, 2);
  const base: SearchResult = {
    id: game.id,
    title: game.title,
    category: game.category,
    type: "game",
    href: `/games/${game.id}`,
    snippet: `Play ${game.title}, a ${game.category} game on Sonke Kids.`,
    tags: [game.category, game.categoryId, ...game.title.toLowerCase().split(/\s+/)],
  };

  const factResults: SearchResult[] = funFacts.map((fact, index) => ({
    id: `${game.id}-fact-${index}`,
    title: `Did you know? — ${game.title}`,
    category: game.category,
    type: "fact",
    href: `/games/${game.id}#facts`,
    snippet: fact,
    tags: [...base.tags, "fact", "trivia"],
  }));

  const quizResult: SearchResult = {
    id: `${game.id}-quiz`,
    title: `${game.title} Quiz`,
    category: game.category,
    type: "quiz",
    href: `/games/${game.id}#quiz-${game.id}`,
    snippet: `Test what you learned in ${game.title}.`,
    tags: [...base.tags, "quiz"],
  };

  const activityResult: SearchResult = {
    id: `${game.id}-activity`,
    title: `${game.title} Activities`,
    category: game.category,
    type: "activity",
    href: `/games/${game.id}#play-${game.id}`,
    snippet: `Bonus activities and challenges for ${game.title}.`,
    tags: [...base.tags, "activity"],
  };

  return [base, ...factResults, quizResult, activityResult];
}

let cachedIndex: SearchResult[] | null = null;

export function buildSearchIndex(): SearchResult[] {
  if (cachedIndex) return cachedIndex;
  cachedIndex = loadCatalog().games.flatMap(gameToSearchResults);
  return cachedIndex;
}

export function searchContent(query: string, limit = 24): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const index = buildSearchIndex();
  const scored = index
    .map((entry) => {
      const haystack = `${entry.title} ${entry.category} ${entry.snippet} ${entry.tags.join(" ")}`.toLowerCase();
      let score = 0;
      if (entry.title.toLowerCase().includes(q)) score += 10;
      if (entry.category.toLowerCase().includes(q)) score += 6;
      if (haystack.includes(q)) score += 4;
      for (const word of q.split(/\s+/)) {
        if (word.length > 2 && haystack.includes(word)) score += 2;
      }
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const { entry } of scored) {
    if (seen.has(entry.id)) continue;
    seen.add(entry.id);
    results.push(entry);
    if (results.length >= limit) break;
  }
  return results;
}
