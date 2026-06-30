import type { LayoutTemplate, SonkeGame } from "./types";
import { hashString, pickFrom, rangeFrom } from "./hash";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const LAYOUTS: LayoutTemplate[] = ["A", "B", "C", "D"];

const CATEGORY_TAGS: Record<string, string[]> = {
  "puzzle-games": ["Logic", "Memory", "Puzzle"],
  "maze-games": ["Logic", "Coordination", "Problem Solving"],
  "hidden-object-games": ["Attention", "Vocabulary", "Observation"],
  "coloring-games": ["Creativity", "Art", "Colors"],
  "drawing-games": ["Creativity", "Art", "Coordination"],
  "music-games": ["Music", "Rhythm", "Listening"],
  "animal-games": ["Animals", "Science", "Nature"],
  "dinosaur-games": ["Dinosaurs", "Science", "History"],
  "space-games": ["Space", "Science", "Astronomy"],
  "food-games": ["Food", "Cooking", "Nutrition"],
  "math-games": ["Mathematics", "Numbers", "Logic"],
  "reading-games": ["Reading", "Language", "Literacy"],
  "science-games": ["Science", "Experiments", "Curiosity"],
  "geography-games": ["Geography", "Culture", "Maps"],
  "sports-games": ["Sports", "Coordination", "Teamwork"],
  "weather-games": ["Weather", "Science", "Nature"],
  "history-games": ["History", "Culture", "Stories"],
  "adventure-games": ["Adventure", "Exploration", "Imagination"],
  "logic-games": ["Logic", "Critical Thinking", "Puzzle"],
  "creativity-games": ["Creativity", "Imagination", "Art"],
  "seasonal-games": ["Seasons", "Celebrations", "Creativity"],
};

export function getLayoutTemplate(game: SonkeGame): LayoutTemplate {
  return LAYOUTS[hashString(game.id) % LAYOUTS.length];
}

export function deriveGameMeta(game: SonkeGame) {
  const difficulty = pickFrom(game.id, DIFFICULTIES);
  const ageMin = rangeFrom(`${game.id}-min`, 4, 5);
  const ageMax = rangeFrom(`${game.id}-max`, 7, 9);
  const playTimeMinutes = rangeFrom(`${game.id}-play`, 5, 15);
  const readingTimeMinutes = rangeFrom(`${game.id}-read`, 2, 5);

  const titleWords = game.title
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2);

  const categoryTags = CATEGORY_TAGS[game.categoryId] ?? [game.category];
  const tags = [...new Set([...categoryTags, ...titleWords.slice(0, 3)])];

  const keywords = [
    game.title,
    game.category,
    ...tags,
    "Sonke Kids",
    "educational game",
    "kids game",
  ];

  return {
    difficulty,
    ageMin,
    ageMax,
    playTimeMinutes,
    readingTimeMinutes,
    tags,
    keywords,
    badgeName: pickFrom(`${game.id}-badge`, [
      "Explorer",
      "Champion",
      "Star Player",
      "Quick Thinker",
      "Creative Hero",
      "Super Learner",
    ]),
  };
}
