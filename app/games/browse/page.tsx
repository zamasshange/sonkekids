import Link from "next/link";
import { loadCatalog } from "@/lib/games/catalog";
import { SonkePbsPage } from "@/components/game/SonkePbsPage";
import { ContentModule, SectionHeading } from "@/components/game/content/shared";

export const metadata = {
  title: "All Games | Sonke Kids",
  description: "Browse all 254 Sonke Kids games by category.",
};

export default function GamesBrowsePage() {
  const catalog = loadCatalog();

  return (
    <SonkePbsPage pageTitle="All Games">
      <ContentModule className="sonke-game-hero-module">
        <div className="sonke-game-hero-copy">
          <p className="sonke-game-badge">All Games</p>
          <h2 className="sonke-game-title">{catalog.totalGames} Games to Play</h2>
          <p className="sonke-game-tagline">Browse every Sonke Kids game by category and jump into play.</p>
          <Link href="/games/search" className="sonke-btn sonke-btn-play">
            Search Games
          </Link>
        </div>
      </ContentModule>

      {catalog.categories.map((category) => (
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
