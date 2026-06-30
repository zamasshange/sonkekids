import type { AiGameContent, SonkeGame } from "./types";
import type { GameTypeDefinition } from "./types";
import { buildFunFacts, buildTips } from "./topic-facts";
import {
  buildActivityIdeas,
  buildAdventureText,
  buildLearningBenefits,
  buildQuizFallback,
} from "./seo";

export function buildFallbackContent(
  game: SonkeGame,
  gameType: GameTypeDefinition,
): AiGameContent {
  const funFacts = buildFunFacts(game, 3);
  const learningGoals = gameType.skills;

  return {
    tagline: `Play ${game.title} and learn while having fun!`,
    description: `${game.title} is a ${game.category.toLowerCase()} activity on Sonke Kids. ${gameType.purpose}`,
    introduction: `Welcome to ${game.title}! ${gameType.howItWorks} Kids ages 4–9 can build ${learningGoals.slice(0, 2).join(" and ")} skills while playing.`,
    howToPlay: [
      `Start ${game.title} and look for the goal at the top of the screen.`,
      "Use your mouse, finger, or keyboard to complete each challenge.",
      "Earn stars by finishing rounds and try to beat your best score!",
    ],
    tips: buildTips(game, gameType.playerKind),
    funFact: funFacts[0],
    funFacts,
    learningGoals,
    learningBenefits: buildLearningBenefits(learningGoals),
    skillsDeveloped: learningGoals,
    quizQuestions: buildQuizFallback(game, funFacts),
    activityIdeas: buildActivityIdeas(game),
    adventureText: buildAdventureText(game),
  };
}
