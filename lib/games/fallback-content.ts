import type { AiGameContent, SonkeGame } from "./types";
import type { GameTypeDefinition } from "./types";

export function buildFallbackContent(
  game: SonkeGame,
  gameType: GameTypeDefinition,
): AiGameContent {
  return {
    tagline: `Play ${game.title} and learn while having fun!`,
    description: `${game.title} is a ${game.category.toLowerCase()} activity on Sonke Kids. ${gameType.purpose}`,
    howToPlay: [
      "Read the goal at the top of the game board.",
      "Use your mouse, finger, or keyboard to complete each challenge.",
      "Earn stars by finishing rounds and try to beat your best score!",
    ],
    funFact: `This game helps kids practice ${gameType.skills.slice(0, 2).join(" and ")}.`,
    learningGoals: gameType.skills,
  };
}
