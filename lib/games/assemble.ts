import type { AiGameContent, GamePageData, SonkeGame } from "./types";
import type { GameTypeDefinition } from "./types";
import { deriveGameMeta, getLayoutTemplate } from "./content-meta";
import { buildGameImages } from "./images";
import { getRelatedGames } from "./catalog";
import { getSuggestedGames, buildRelatedContent } from "./related";
import {
  buildActivityIdeas,
  buildAdventureText,
  buildLearningBenefits,
  buildQuizFallback,
  buildSeoMetadata,
} from "./seo";
import { buildFunFacts, buildTips } from "./topic-facts";
import { getPlayUrlForSonkeGame } from "./play-url";

function normalizeAi(
  partial: Partial<AiGameContent>,
  game: SonkeGame,
  gameType: GameTypeDefinition,
): AiGameContent {
  const funFacts = partial.funFacts?.length
    ? partial.funFacts
    : partial.funFact
      ? [partial.funFact, ...buildFunFacts(game, 2)]
      : buildFunFacts(game, 3);

  const learningGoals = partial.learningGoals?.length ? partial.learningGoals : gameType.skills;
  const skillsDeveloped = partial.skillsDeveloped?.length ? partial.skillsDeveloped : gameType.skills;

  return {
    tagline: partial.tagline ?? `Play ${game.title} and learn while having fun!`,
    description:
      partial.description ??
      `${game.title} is a ${game.category.toLowerCase()} activity on Sonke Kids. ${gameType.purpose}`,
    introduction:
      partial.introduction ??
      `Get ready for ${game.title}! ${gameType.purpose} This ${game.category.toLowerCase()} adventure is perfect for curious kids who love to explore and learn.`,
    howToPlay: partial.howToPlay?.length
      ? partial.howToPlay
      : [
          `Open ${game.title} and read the goal.`,
          "Use your mouse, finger, or keyboard to play.",
          "Complete each challenge and try to beat your best score!",
        ],
    tips: partial.tips?.length ? partial.tips : buildTips(game, gameType.playerKind),
    funFact: partial.funFact ?? funFacts[0],
    funFacts: [...new Set(funFacts)].slice(0, 5),
    learningGoals,
    learningBenefits: partial.learningBenefits?.length
      ? partial.learningBenefits
      : buildLearningBenefits(learningGoals),
    skillsDeveloped,
    quizQuestions: partial.quizQuestions?.length
      ? partial.quizQuestions
      : buildQuizFallback(game, funFacts),
    activityIdeas: partial.activityIdeas?.length ? partial.activityIdeas : buildActivityIdeas(game),
    adventureText: partial.adventureText ?? buildAdventureText(game),
  };
}

export function assembleGamePageData(
  base: {
    game: SonkeGame;
    gameType: GamePageData["gameType"];
    wikipedia: GamePageData["wikipedia"];
    ai: Partial<AiGameContent>;
    heroImage: string | null;
    enrichedAt: string;
  },
  gameTypeDef: GameTypeDefinition,
): GamePageData {
  const { game, gameType, wikipedia, heroImage, enrichedAt } = base;
  const ai = normalizeAi(base.ai, game, gameTypeDef);
  const meta = deriveGameMeta(game);
  const images = buildGameImages(game, wikipedia);
  const layout = getLayoutTemplate(game);
  const relatedGames = getRelatedGames(game);
  const suggestedGames = getSuggestedGames(game);
  const relatedContent = buildRelatedContent(game);

  const pageSlice = { game, ai, heroImage, meta };
  const seo = buildSeoMetadata(pageSlice);

  return {
    game,
    gameType,
    layout,
    meta,
    images,
    wikipedia,
    ai,
    heroImage,
    relatedGames,
    suggestedGames: suggestedGames.length > 0 ? suggestedGames : relatedGames,
    relatedContent,
    seo,
    enrichedAt,
    playUrl: getPlayUrlForSonkeGame(game.id),
  };
}
