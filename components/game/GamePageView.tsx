import Link from "next/link";
import type { GamePageData } from "@/lib/games/types";
import { GamePlayer } from "./players/GamePlayer";
import "./game-page.css";

export function GamePageView({ data }: { data: GamePageData }) {
  const { game, gameType, wikipedia, ai, heroImage, relatedGames } = data;

  return (
    <div className="sonke-game-page" data-category={game.categoryId}>
      <header className="sonke-game-header">
        <div className="sonke-game-header-inner">
          <Link href="/" className="sonke-logo-chip" aria-label="Sonke Kids home">
            <span className="sonke-logo-mark">SK</span>
            <span>Sonke Kids</span>
          </Link>
          <nav className="sonke-game-nav" aria-label="Site">
            <Link href="/games">Games</Link>
            <Link href="/games/browse">All Games</Link>
            <Link href="/videos">Videos</Link>
          </nav>
        </div>
      </header>

      <main className="sonke-game-main">
        <section className="sonke-game-hero">
          <div className="sonke-game-hero-copy">
            <p className="sonke-game-badge">{game.category}</p>
            <h1>{game.title}</h1>
            <p className="sonke-game-tagline">{ai.tagline}</p>
            <p className="sonke-game-purpose">{gameType.purpose}</p>
          </div>
          <div className="sonke-game-hero-art">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroImage} alt={wikipedia?.title ?? game.title} className="sonke-game-hero-image" />
            ) : (
              <div className="sonke-game-hero-fallback" aria-hidden="true">
                <span>🎮</span>
              </div>
            )}
          </div>
        </section>

        <section className="sonke-game-play themed-module">
          <div className="themed-module-head">
            <h2>Play {game.title}</h2>
            <p>{gameType.howItWorks}</p>
          </div>
          <GamePlayer title={game.title} gameType={gameType} />
        </section>

        <div className="sonke-game-columns">
          <section className="sonke-game-panel">
            <h2>How to Play</h2>
            <ol className="sonke-steps">
              {ai.howToPlay.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <h3>What You&apos;ll Learn</h3>
            <ul className="sonke-skills">
              {ai.learningGoals.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>

          <section className="sonke-game-panel sonke-game-panel-wiki">
            <h2>Discover More</h2>
            <p className="sonke-game-description">{ai.description}</p>
            <p className="sonke-fun-fact">
              <strong>Fun fact:</strong> {ai.funFact}
            </p>
            {wikipedia ? (
              <article className="sonke-wiki-card">
                <h3>From Wikipedia: {wikipedia.title}</h3>
                <p>{wikipedia.extract}</p>
                <a href={wikipedia.pageUrl} target="_blank" rel="noreferrer">
                  Read more on Wikipedia
                </a>
              </article>
            ) : (
              <p className="sonke-wiki-fallback">
                We&apos;re gathering extra facts for this game. Check back soon!
              </p>
            )}
          </section>
        </div>

        {relatedGames.length > 0 && (
          <section className="sonke-related">
            <h2>More {game.category}</h2>
            <ul className="sonke-related-grid">
              {relatedGames.map((related) => (
                <li key={related.id}>
                  <Link href={`/games/${related.id}`} className="sonke-related-card">
                    <span className="sonke-related-title">{related.title}</span>
                    <span className="sonke-related-cta">Play</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
