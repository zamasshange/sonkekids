import { getGameById, getRelatedGames } from "./catalog";
import { getGameType } from "./game-types";
import { readCachedGamePage, writeCachedGamePage } from "./cache";
import { buildFallbackContent } from "./fallback-content";
import { fetchWikipediaForTerms } from "../wikipedia";
import { generateGameContent } from "../openrouter";
import type { GamePageData, SerializableGameType } from "./types";
import type { GameTypeDefinition } from "./types";

function toSerializable(gameType: GameTypeDefinition): SerializableGameType {
  return {
    id: gameType.id,
    purpose: gameType.purpose,
    howItWorks: gameType.howItWorks,
    skills: gameType.skills,
    playerKind: gameType.playerKind,
  };
}

export function buildGamePageDataFast(slug: string): GamePageData | null {
  const game = getGameById(slug);
  if (!game) return null;

  const gameType = getGameType(game);
  return {
    game,
    gameType: toSerializable(gameType),
    wikipedia: null,
    ai: buildFallbackContent(game, gameType),
    heroImage: null,
    relatedGames: getRelatedGames(game),
    enrichedAt: new Date().toISOString(),
  };
}

export async function enrichGamePage(slug: string, options?: { force?: boolean }): Promise<GamePageData | null> {
  const game = getGameById(slug);
  if (!game) return null;

  if (!options?.force) {
    const cached = readCachedGamePage(slug);
    if (cached) return cached;
  }

  const gameType = getGameType(game);
  const wikipedia = await fetchWikipediaForTerms(gameType.wikiSearchTerms(game));
  const ai = await generateGameContent(game, gameType, wikipedia?.extract);

  const data: GamePageData = {
    game,
    gameType: toSerializable(gameType),
    wikipedia,
    ai,
    heroImage: wikipedia?.imageUrl ?? wikipedia?.thumbnailUrl ?? null,
    relatedGames: getRelatedGames(game),
    enrichedAt: new Date().toISOString(),
  };

  writeCachedGamePage(slug, data);
  return data;
}

export async function getGamePageData(slug: string): Promise<GamePageData | null> {
  const cached = readCachedGamePage(slug);
  if (cached) return cached;
  return buildGamePageDataFast(slug);
}
