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

export type LayoutTemplate = "A" | "B" | "C" | "D";

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

export type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
};

export type RelatedContentItem = {
  type: "story" | "video" | "activity" | "quiz" | "article" | "collection" | "music";
  title: string;
  href: string;
  description?: string;
};

export type AiGameContent = {
  tagline: string;
  description: string;
  introduction: string;
  howToPlay: string[];
  tips: string[];
  funFact: string;
  funFacts: string[];
  learningGoals: string[];
  learningBenefits: string[];
  skillsDeveloped: string[];
  quizQuestions: QuizQuestion[];
  activityIdeas: string[];
  adventureText: string;
};

export type GameMeta = {
  difficulty: "Easy" | "Medium" | "Hard";
  ageMin: number;
  ageMax: number;
  playTimeMinutes: number;
  readingTimeMinutes: number;
  tags: string[];
  keywords: string[];
  badgeName: string;
};

export type GameImages = {
  banner: string | null;
  thumbnail: string | null;
  icon: string;
  background: string;
  categoryImage: string | null;
  gallery: string[];
};

export type SeoMetadata = {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;
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
  layout: LayoutTemplate;
  meta: GameMeta;
  images: GameImages;
  wikipedia: WikipediaData | null;
  ai: AiGameContent;
  heroImage: string | null;
  relatedGames: SonkeGame[];
  suggestedGames: SonkeGame[];
  relatedContent: RelatedContentItem[];
  seo: SeoMetadata;
  enrichedAt: string;
  /** PBS play shell URL when this game maps to a cached PBS play page */
  playUrl: string | null;
};

export type PbsSlugMapping = {
  pbsSlug: string;
  sonkeId: string;
  title: string;
};

export type SearchResult = {
  id: string;
  title: string;
  category: string;
  type: "game" | "fact" | "activity" | "quiz";
  href: string;
  snippet: string;
  tags: string[];
};
