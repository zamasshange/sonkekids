import Link from "next/link";
import type { GamePageData } from "@/lib/games/types";
import { GamePlayer } from "./players/GamePlayer";
import { SonkePbsPage } from "./SonkePbsPage";

export function GamePageView({ data }: { data: GamePageData }) {
  const { game, gameType, wikipedia, ai, heroImage, relatedGames } = data;

  return (
    <SonkePbsPage pageTitle={game.title}>
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
            <p className="sonke-game-badge">{game.category}</p>
            <h2 className="sonke-game-title">{game.title}</h2>
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
        </div>
      </div>

      <div data-theme-context="module" data-theme-module-contextid="sonke-game" className="ThemedModule_moduleWrapper__8K1_V">
        <div className="ThemedModule_innerContent__58wFN sonke-game-play">
          <div className="GamesCollage_iconHeaderWrapper__b6FGa">
            <h2 className="sonke-section-title">Play {game.title}</h2>
          </div>
          <p className="sonke-section-lead">{gameType.howItWorks}</p>
          <GamePlayer title={game.title} gameType={gameType} />
        </div>
      </div>

      <div className="sonke-game-columns">
        <div data-theme-context="module" data-theme-module-contextid="sonke-game" className="ThemedModule_moduleWrapper__8K1_V sonke-game-panel">
          <div className="ThemedModule_innerContent__58wFN">
            <h2 className="sonke-section-title">How to Play</h2>
            <ol className="sonke-steps">
              {ai.howToPlay.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <h3 className="sonke-subsection-title">What You&apos;ll Learn</h3>
            <ul className="sonke-skills">
              {ai.learningGoals.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>

        <div data-theme-context="module" data-theme-module-contextid="sonke-game" className="ThemedModule_moduleWrapper__8K1_V sonke-game-panel">
          <div className="ThemedModule_innerContent__58wFN">
            <h2 className="sonke-section-title">Discover More</h2>
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
              <p className="sonke-wiki-fallback">We&apos;re gathering extra facts for this game. Check back soon!</p>
            )}
          </div>
        </div>
      </div>

      {relatedGames.length > 0 && (
        <div data-theme-context="module" data-theme-module-contextid="sonke-game" className="ThemedModule_moduleWrapper__8K1_V sonke-related-module">
          <div className="ThemedModule_innerContent__58wFN">
            <h2 className="sonke-section-title">More {game.category}</h2>
            <ul className="sonke-related-grid">
              {relatedGames.map((related) => (
                <li key={related.id}>
                  <Link href={`/games/${related.id}`} className="sonke-related-card MediaItem_mediaLink__JSobH">
                    <span className="sonke-related-title MediaItem_heading__AybaX">{related.title}</span>
                    <span className="sonke-related-cta">Play</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </SonkePbsPage>
  );
}
