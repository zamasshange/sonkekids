import Link from "next/link";
import { loadCatalog } from "@/lib/games/catalog";
import { SonkePbsPage } from "@/components/game/SonkePbsPage";
import { ContentModule, SectionHeading } from "@/components/game/content/shared";

export const metadata = {
  title: "All Games | Sonke Kids",
  description: "Browse all Sonke Kids learning games by category.",
};

type BrowsePageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function GamesBrowsePage({ searchParams }: BrowsePageProps) {
  const { category: activeCategory } = await searchParams;
  const catalog = loadCatalog();

  const categories = activeCategory
    ? catalog.categories.filter((c) => c.id === activeCategory)
    : catalog.categories;

  return (
    <SonkePbsPage pageTitle="All Games">
      <ContentModule className="sonke-game-hero-module">
        <div className="sonke-game-hero-copy">
          <p className="sonke-game-badge">All Games</p>
          <h2 className="sonke-game-title">{catalog.totalGames} Games to Play</h2>
          <p className="sonke-game-tagline">
            Puzzle, maze, memory, quiz, and creative games for curious kids.
          </p>
          <div className="sonke-play-actions">
            <Link href="/games/search" className="sonke-btn sonke-btn-play">
              Search Games
            </Link>
            <Link href="/videos" className="sonke-btn sonke-btn-secondary">
              Watch Videos
            </Link>
          </div>
        </div>
      </ContentModule>

      <ContentModule>
        <nav className="sonke-category-nav" aria-label="Game categories">
          <Link
            href="/games/browse"
            className={!activeCategory ? "sonke-category-pill active" : "sonke-category-pill"}
          >
            All
          </Link>
          {catalog.categories.map((category) => (
            <Link
              key={category.id}
              href={`/games/browse?category=${category.id}`}
              className={
                activeCategory === category.id
                  ? "sonke-category-pill active"
                  : "sonke-category-pill"
              }
            >
              {category.title}
            </Link>
          ))}
        </nav>
      </ContentModule>

      {categories.map((category) => (
        <ContentModule key={category.id} className="sonke-related-module">
          <SectionHeading>{category.title}</SectionHeading>
          <ul className="GamesCollage_gamesGrid__jv6Iv sonke-related-grid">
            {category.games.map((game) => (
              <li key={game.id}>
                <Link href={`/games/${game.id}`} className="MediaItem_mediaLink__JSobH sonke-related-card">
                  <p className="MediaItem_heading__AybaX sonke-related-title">{game.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </ContentModule>
      ))}
    </SonkePbsPage>
  );
}
