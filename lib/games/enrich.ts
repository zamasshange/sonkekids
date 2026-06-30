import { getGameById, getRelatedGames } from "./catalog";
import { getGameType } from "./game-types";
import { readCachedGamePage, writeCachedGamePage } from "./cache";
import { buildFallbackContent } from "./fallback-content";
import { fetchWikipediaForTerms } from "../wikipedia";
import { generateGameContent } from "../openrouter";
import { assembleGamePageData } from "./assemble";
import { buildWikiSearchTerms } from "./topic-facts";
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

function migrateCachedPage(cached: GamePageData, gameTypeDef: GameTypeDefinition): GamePageData {
  if (cached.layout && cached.meta && cached.seo && cached.ai.funFacts) {
    return cached;
  }

  return assembleGamePageData(
    {
      game: cached.game,
      gameType: cached.gameType,
      wikipedia: cached.wikipedia,
      ai: cached.ai,
      heroImage: cached.heroImage,
      enrichedAt: cached.enrichedAt,
    },
    gameTypeDef,
  );
}

export function buildGamePageDataFast(slug: string): GamePageData | null {
  const game = getGameById(slug);
  if (!game) return null;

  const gameTypeDef = getGameType(game);
  return assembleGamePageData(
    {
      game,
      gameType: toSerializable(gameTypeDef),
      wikipedia: null,
      ai: buildFallbackContent(game, gameTypeDef),
      heroImage: null,
      enrichedAt: new Date().toISOString(),
    },
    gameTypeDef,
  );
}

export async function enrichGamePage(slug: string, options?: { force?: boolean }): Promise<GamePageData | null> {
  const game = getGameById(slug);
  if (!game) return null;

  const gameTypeDef = getGameType(game);

  if (!options?.force) {
    const cached = readCachedGamePage(slug);
    if (cached) return migrateCachedPage(cached, gameTypeDef);
  }

  const wikiTerms = [...buildWikiSearchTerms(game), ...gameTypeDef.wikiSearchTerms(game)];
  const wikipedia = await fetchWikipediaForTerms([...new Set(wikiTerms)]);
  const ai = await generateGameContent(game, gameTypeDef, wikipedia?.extract);

  const data = assembleGamePageData(
    {
      game,
      gameType: toSerializable(gameTypeDef),
      wikipedia,
      ai,
      heroImage: wikipedia?.imageUrl ?? wikipedia?.thumbnailUrl ?? null,
      enrichedAt: new Date().toISOString(),
    },
    gameTypeDef,
  );

  writeCachedGamePage(slug, data);
  return data;
}

export async function getGamePageData(slug: string): Promise<GamePageData | null> {
  const game = getGameById(slug);
  if (!game) return null;

  const gameTypeDef = getGameType(game);
  const cached = readCachedGamePage(slug);
  if (cached) return migrateCachedPage(cached, gameTypeDef);
  return buildGamePageDataFast(slug);
}

export { getRelatedGames };
