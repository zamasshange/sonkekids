import slugMappings from "@/content/games-slug-map.json";
import catalog from "@/content/sonke-games-catalog.json";

const PBS_TO_SONKE = new Map<string, string>();
for (const item of slugMappings) {
  if (!PBS_TO_SONKE.has(item.pbsSlug)) {
    PBS_TO_SONKE.set(item.pbsSlug, item.sonkeId);
  }
}

const SONKE_IDS = new Set(catalog.games.map((game) => game.id));

export function getDefaultGameId(): string {
  const first = slugMappings[0];
  return first?.sonkeId ?? catalog.games[0]?.id ?? "mega-connect-four";
}

/** Resolve a PBS play URL slug to a Sonke catalog game id. Edge-safe. */
export function resolveSonkeGameId(slug: string): string | null {
  const mapped = PBS_TO_SONKE.get(slug);
  if (mapped) return mapped;
  if (SONKE_IDS.has(slug)) return slug;
  return null;
}

export function getPbsToSonkeMap(): Record<string, string> {
  return Object.fromEntries(PBS_TO_SONKE.entries());
}

/** All slugs that should resolve to a playable game page. */
export function getAllPlayableSlugs(): string[] {
  const slugs = new Set<string>();
  for (const game of catalog.games) slugs.add(game.id);
  for (const item of slugMappings) slugs.add(item.pbsSlug);
  return [...slugs];
}
