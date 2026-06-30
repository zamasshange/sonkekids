import Link from "next/link";
import { loadCatalog } from "@/lib/games/catalog";
import { SonkePbsPage } from "@/components/game/SonkePbsPage";

export const metadata = {
  title: "All Games | Sonke Kids",
  description: "Browse all 254 Sonke Kids games by category.",
};

export default function GamesBrowsePage() {
  const catalog = loadCatalog();

  return (
    <SonkePbsPage pageTitle="All Games">
      <div
        data-theme-context="module"
        data-theme-background-mode="pattern"
        data-theme-module-contextid="sonke-game"
        className="ThemedModule_moduleWrapper__8K1_V sonke-game-hero-module"
      >
        <div className="ThemedModule_bgLayers__8BKwC">
          <div className="ThemedModule_solidColor__mtJEd" />
          <div className="ThemedModule_pattern__rqwkC" />
        </div>
        <div className="ThemedModule_innerContent__58wFN sonke-game-hero">
          <div className="sonke-game-hero-copy">
            <p className="sonke-game-badge">All Games</p>
            <h2 className="sonke-game-title">{catalog.totalGames} Games to Play</h2>
            <p className="sonke-game-tagline">Browse every Sonke Kids game by category and jump into play.</p>
            <Link href="/games/search" className="sonke-btn sonke-btn-play">
              Search Games
            </Link>
          </div>
        </div>
      </div>

      {catalog.categories.map((category) => (
        <div
          key={category.id}
          data-theme-context="module"
          data-theme-module-contextid="sonke-game"
          className="ThemedModule_moduleWrapper__8K1_V sonke-related-module"
        >
          <div className="ThemedModule_innerContent__58wFN">
            <h2 className="sonke-section-title">{category.title}</h2>
            <ul className="sonke-related-grid">
              {category.games.map((game) => (
                <li key={game.id}>
                  <Link href={`/games/${game.id}`} className="sonke-related-card MediaItem_mediaLink__JSobH">
                    <span className="sonke-related-title MediaItem_heading__AybaX">{game.title}</span>
                    <span className="sonke-related-cta">Play</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </SonkePbsPage>
  );
}
