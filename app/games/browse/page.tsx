import Link from "next/link";
import { loadCatalog } from "@/lib/games/catalog";
import "@/components/game/game-page.css";

export const metadata = {
  title: "All Games | Sonke Kids",
  description: "Browse all 254 Sonke Kids games by category.",
};

export default function GamesBrowsePage() {
  const catalog = loadCatalog();

  return (
    <div className="sonke-game-page">
      <header className="sonke-game-header">
        <div className="sonke-game-header-inner">
          <Link href="/" className="sonke-logo-chip">
            <span className="sonke-logo-mark">SK</span>
            <span>Sonke Kids</span>
          </Link>
          <nav className="sonke-game-nav">
            <Link href="/games">Games Home</Link>
            <Link href="/videos">Videos</Link>
          </nav>
        </div>
      </header>

      <main className="sonke-game-main">
        <section className="sonke-game-hero">
          <div className="sonke-game-hero-copy">
            <p className="sonke-game-badge">All Games</p>
            <h1>{catalog.totalGames} Games to Play</h1>
            <p className="sonke-game-tagline">
              Browse every Sonke Kids game by category and jump into play.
            </p>
          </div>
        </section>

        {catalog.categories.map((category) => (
          <section key={category.id} className="sonke-related">
            <h2>{category.title}</h2>
            <ul className="sonke-related-grid">
              {category.games.map((game) => (
                <li key={game.id}>
                  <Link href={`/games/${game.id}`} className="sonke-related-card">
                    <span className="sonke-related-title">{game.title}</span>
                    <span className="sonke-related-cta">Play</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
