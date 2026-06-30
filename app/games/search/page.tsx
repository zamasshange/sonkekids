import { SonkePbsPage } from "@/components/game/SonkePbsPage";
import { GameSearch } from "@/components/game/GameSearch";
import { ContentModule } from "@/components/game/content/shared";
import { buildSearchIndex } from "@/lib/games/search-data";

export const metadata = {
  title: "Search Games | Sonke Kids",
  description: "Search Sonke Kids games, facts, quizzes, and activities.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function GamesSearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const index = buildSearchIndex();

  return (
    <SonkePbsPage pageTitle="Search">
      <ContentModule className="sonke-game-hero-module">
        <div className="sonke-game-hero-copy">
          <p className="sonke-game-badge">Search</p>
          <h2 className="sonke-game-title">Find Games &amp; Facts</h2>
          <p className="sonke-game-tagline">
            Search for games, fun facts, quizzes, and activities across Sonke Kids.
          </p>
        </div>
      </ContentModule>
      <ContentModule>
        <GameSearch initialQuery={q ?? ""} index={index} />
      </ContentModule>
    </SonkePbsPage>
  );
}
