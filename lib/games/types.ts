export type SonkeGame = {
  id: string;
  title: string;
  categoryId: string;
  category: string;
};

export type SonkeCategory = {
  id: string;
  title: string;
  count: number;
  games: { id: string; title: string }[];
};

export type SonkeCatalog = {
  version: number;
  totalGames: number;
  totalCategories: number;
  categories: SonkeCategory[];
  games: SonkeGame[];
};

export type GameTypeDefinition = {
  id: string;
  purpose: string;
  howItWorks: string;
  skills: string[];
  playerKind: "match" | "maze" | "hidden-object" | "coloring" | "drawing" | "music" | "quiz" | "arcade" | "default";
  wikiSearchTerms: (game: SonkeGame) => string[];
};

export type WikipediaData = {
  title: string;
  extract: string;
  description: string;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  pageUrl: string;
};

export type AiGameContent = {
  tagline: string;
  description: string;
  howToPlay: string[];
  funFact: string;
  learningGoals: string[];
};

export type SerializableGameType = {
  id: string;
  purpose: string;
  howItWorks: string;
  skills: string[];
  playerKind: GameTypeDefinition["playerKind"];
};

export type GamePageData = {
  game: SonkeGame;
  gameType: SerializableGameType;
  wikipedia: WikipediaData | null;
  ai: AiGameContent;
  heroImage: string | null;
  relatedGames: SonkeGame[];
  enrichedAt: string;
};

export type PbsSlugMapping = {
  pbsSlug: string;
  sonkeId: string;
  title: string;
};
