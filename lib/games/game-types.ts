import type { GameTypeDefinition, SonkeGame } from "./types";

const base = (playerKind: GameTypeDefinition["playerKind"], purpose: string, howItWorks: string, skills: string[]): Omit<GameTypeDefinition, "id" | "wikiSearchTerms"> => ({
  purpose,
  howItWorks,
  skills,
  playerKind,
});

export const GAME_TYPES: Record<string, GameTypeDefinition> = {
  "puzzle-games": {
    id: "puzzle-games",
    ...base("match", "Build thinking skills by matching pairs, patterns, and shapes.", "Players compare cards or tiles and find matches before time runs out.", ["memory", "patterns", "logic", "focus"]),
    wikiSearchTerms: (g) => [g.title, "puzzle video game", "educational game"],
  },
  "maze-games": {
    id: "maze-games",
    ...base("maze", "Practice planning and direction skills while navigating fun mazes.", "Players guide a character from start to finish without hitting walls.", ["spatial reasoning", "problem solving", "patience"]),
    wikiSearchTerms: (g) => [g.title, "maze", "labyrinth"],
  },
  "hidden-object-games": {
    id: "hidden-object-games",
    ...base("hidden-object", "Sharpen observation skills by spotting hidden items in busy scenes.", "Players scan illustrated scenes and tap objects on a checklist.", ["attention to detail", "vocabulary", "visual scanning"]),
    wikiSearchTerms: (g) => [g.title.replace("Find the ", ""), "hidden object game"],
  },
  "coloring-games": {
    id: "coloring-games",
    ...base("coloring", "Express creativity while learning colors and fine motor control.", "Players pick colors and fill regions in friendly illustrations.", ["creativity", "color recognition", "fine motor skills"]),
    wikiSearchTerms: (g) => [g.title.replace("Color ", ""), "coloring book"],
  },
  "drawing-games": {
    id: "drawing-games",
    ...base("drawing", "Develop art skills through guided drawing and tracing activities.", "Players follow steps or trace lines to complete pictures.", ["creativity", "hand-eye coordination", "shapes"]),
    wikiSearchTerms: (g) => [g.title.replace("Draw a ", "").replace("Trace the ", ""), "drawing"],
  },
  "music-games": {
    id: "music-games",
    ...base("music", "Explore rhythm, sound, and melody through playful music activities.", "Players tap beats, match sounds, or play simple instruments.", ["rhythm", "listening skills", "creativity"]),
    wikiSearchTerms: (g) => [g.title, "musical instrument", "music education"],
  },
  "animal-games": {
    id: "animal-games",
    ...base("default", "Learn about animals, habitats, and caring for living creatures.", "Players interact with animals through care, rescue, and discovery mini-games.", ["science", "empathy", "nature"]),
    wikiSearchTerms: (g) => [g.title, "animal", "wildlife"],
  },
  "dinosaur-games": {
    id: "dinosaur-games",
    ...base("default", "Discover prehistoric life through digging, building, and dino adventures.", "Players explore fossils, assemble dinosaurs, and run dino-themed challenges.", ["paleontology", "history", "curiosity"]),
    wikiSearchTerms: (g) => [g.title, "dinosaur", "prehistoric life"],
  },
  "space-games": {
    id: "space-games",
    ...base("default", "Explore planets, rockets, and the wonders of outer space.", "Players build rockets, dodge meteors, and tour the solar system.", ["astronomy", "science", "imagination"]),
    wikiSearchTerms: (g) => [g.title, "outer space", "Solar System"],
  },
  "food-games": {
    id: "food-games",
    ...base("default", "Learn about cooking, nutrition, and making healthy food choices.", "Players assemble recipes and run playful kitchen challenges.", ["nutrition", "following steps", "creativity"]),
    wikiSearchTerms: (g) => [g.title, "food", "cooking"],
  },
  "math-games": {
    id: "math-games",
    ...base("quiz", "Build number sense through counting, operations, and math puzzles.", "Players solve kid-friendly math challenges with instant feedback.", ["numbers", "logic", "problem solving"]),
    wikiSearchTerms: (g) => [g.title, "mathematics", "elementary mathematics"],
  },
  "reading-games": {
    id: "reading-games",
    ...base("quiz", "Grow literacy skills with letters, words, and playful reading challenges.", "Players match letters, build words, and complete short reading tasks.", ["phonics", "vocabulary", "comprehension"]),
    wikiSearchTerms: (g) => [g.title, "reading", "literacy"],
  },
  "science-games": {
    id: "science-games",
    ...base("default", "Experiment with weather, plants, magnets, and how the world works.", "Players run safe virtual experiments and observe results.", ["scientific thinking", "curiosity", "cause and effect"]),
    wikiSearchTerms: (g) => [g.title, "science", "natural science"],
  },
  "geography-games": {
    id: "geography-games",
    ...base("quiz", "Explore countries, landmarks, and maps from around the world.", "Players match flags, places, and map clues in travel-themed challenges.", ["geography", "culture", "memory"]),
    wikiSearchTerms: (g) => [g.title, "geography", "world geography"],
  },
  "logic-games": {
    id: "logic-games",
    ...base("default", "Strengthen reasoning with sequences, towers, and brain teasers.", "Players solve step-by-step logic puzzles with helpful hints.", ["critical thinking", "strategy", "persistence"]),
    wikiSearchTerms: (g) => [g.title, "logic puzzle", "brain teaser"],
  },
  "adventure-games": {
    id: "adventure-games",
    ...base("arcade", "Go on story-driven quests through jungles, castles, and islands.", "Players explore levels, collect items, and overcome obstacles.", ["exploration", "storytelling", "problem solving"]),
    wikiSearchTerms: (g) => [g.title, "adventure game"],
  },
  "arcade-games": {
    id: "arcade-games",
    ...base("arcade", "Build reflexes and coordination with fast, fun action challenges.", "Players react quickly to pop, catch, or dodge moving objects.", ["hand-eye coordination", "timing", "focus"]),
    wikiSearchTerms: (g) => [g.title, "arcade game"],
  },
  "typing-games": {
    id: "typing-games",
    ...base("default", "Learn keyboard skills by typing letters and words on time.", "Players practice key locations through playful typing missions.", ["typing", "letter recognition", "speed"]),
    wikiSearchTerms: (g) => [g.title, "typing", "keyboard"],
  },
  "sports-games": {
    id: "sports-games",
    ...base("arcade", "Practice sports skills like aiming, timing, and movement.", "Players shoot, swing, or race in friendly sports mini-games.", ["coordination", "sportsmanship", "timing"]),
    wikiSearchTerms: (g) => [g.title, "sport"],
  },
  "memory-games": {
    id: "memory-games",
    ...base("match", "Train recall by remembering positions, sounds, and picture pairs.", "Players flip cards or repeat patterns to strengthen memory.", ["working memory", "concentration", "matching"]),
    wikiSearchTerms: (g) => [g.title, "memory game"],
  },
  "seasonal-games": {
    id: "seasonal-games",
    ...base("default", "Celebrate holidays and seasons with themed puzzles and activities.", "Players enjoy festive challenges tied to holidays and weather.", ["seasons", "traditions", "creativity"]),
    wikiSearchTerms: (g) => [g.title, g.title.split(" ")[0]],
  },
};

export function getGameType(game: SonkeGame): GameTypeDefinition {
  return GAME_TYPES[game.categoryId] ?? {
    id: "default",
    purpose: "Learn through play with a fun Sonke Kids activity.",
    howItWorks: "Players complete kid-friendly challenges with cheerful guidance.",
    skills: ["curiosity", "learning", "fun"],
    playerKind: "default",
    wikiSearchTerms: (g: SonkeGame) => [g.title, "educational game"],
  };
}
