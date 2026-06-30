import type { ReactNode } from "react";
import Link from "next/link";
import type { GamePageData, QuizQuestion, RelatedContentItem, SonkeGame } from "@/lib/games/types";
import { getHeroVisual } from "@/lib/games/images";
import { GamePlayer } from "../players/GamePlayer";
import { PlayActions } from "./PlayActions";

export function ContentModule({
  children,
  className = "",
  pattern = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  pattern?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      data-theme-context="module"
      data-theme-module-contextid="sonke-game"
      data-theme-background-mode={pattern ? "pattern" : undefined}
      className={`ThemedModule_moduleWrapper__8K1_V ${className}`.trim()}
    >
      {pattern && (
        <div className="ThemedModule_bgLayers__8BKwC">
          <div className="ThemedModule_solidColor__mtJEd" />
          <div className="ThemedModule_pattern__rqwkC" />
        </div>
      )}
      <div className="ThemedModule_innerContent__58wFN">{children}</div>
    </div>
  );
}

export function GameMetaBar({ data }: { data: GamePageData }) {
  const { meta } = data;
  return (
    <ul className="sonke-meta-bar" aria-label="Game details">
      <li><strong>Difficulty:</strong> {meta.difficulty}</li>
      <li><strong>Ages:</strong> {meta.ageMin}–{meta.ageMax}</li>
      <li><strong>Play time:</strong> ~{meta.playTimeMinutes} min</li>
      <li><strong>Reading:</strong> ~{meta.readingTimeMinutes} min</li>
    </ul>
  );
}

export function GameHero({ data, large = false }: { data: GamePageData; large?: boolean }) {
  const { game, ai, heroImage } = data;
  const visual = getHeroVisual(game, heroImage);

  return (
    <div className={`sonke-game-hero ${large ? "sonke-game-hero-large" : ""}`}>
      <div className="sonke-game-hero-copy">
        <p className="sonke-game-badge">{game.category}</p>
        <h2 className="sonke-game-title">{game.title}</h2>
        <p className="sonke-game-tagline">{ai.tagline}</p>
        <p className="sonke-game-purpose">{ai.introduction}</p>
        <GameMetaBar data={data} />
        <PlayActions gameId={game.id} title={game.title} />
      </div>
      <div className="sonke-game-hero-art">
        {visual.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={visual.image}
            alt={game.title}
            className="sonke-game-hero-image"
            loading="eager"
          />
        ) : (
          <div
            className="sonke-game-hero-fallback"
            style={{ background: `linear-gradient(135deg, ${visual.gradient[0]}, ${visual.gradient[1]})` }}
            aria-hidden="true"
          >
            <span>{visual.emoji}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function GamePlaySection({ data }: { data: GamePageData }) {
  const { game, gameType, ai } = data;
  return (
    <ContentModule className="sonke-game-play" id={`play-${game.id}`}>
      <div className="GamesCollage_iconHeaderWrapper__b6FGa">
        <h2 className="sonke-section-title">Play {game.title}</h2>
      </div>
      <p className="sonke-section-lead">{gameType.howItWorks}</p>
      <GamePlayer title={game.title} gameType={gameType} />
      <p className="sonke-player-hint">{ai.tips[0]}</p>
    </ContentModule>
  );
}

export function LearningSection({ data }: { data: GamePageData }) {
  const { ai } = data;
  return (
    <ContentModule className="sonke-game-panel">
      <h2 className="sonke-section-title">What You&apos;ll Learn</h2>
      <ul className="sonke-learning-grid">
        {ai.learningBenefits.map((benefit) => (
          <li key={benefit} className="sonke-learning-card">
            <span className="sonke-learning-icon" aria-hidden="true">★</span>
            <p>{benefit}</p>
          </li>
        ))}
      </ul>
      <h3 className="sonke-subsection-title">Skills Developed</h3>
      <ul className="sonke-skills">
        {ai.skillsDeveloped.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </ContentModule>
  );
}

export function HowToPlaySection({ data }: { data: GamePageData }) {
  const { ai } = data;
  return (
    <ContentModule className="sonke-game-panel">
      <h2 className="sonke-section-title">How to Play</h2>
      <ol className="sonke-steps">
        {ai.howToPlay.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <h3 className="sonke-subsection-title">Tips</h3>
      <ul className="sonke-skills">
        {ai.tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </ContentModule>
  );
}

export function FunFactsSection({ data }: { data: GamePageData }) {
  const { game, ai } = data;
  return (
    <ContentModule className="sonke-game-panel" id={`facts-${game.id}`}>
      <h2 className="sonke-section-title">Did You Know?</h2>
      <ul className="sonke-facts-grid" id="facts">
        {ai.funFacts.map((fact) => (
          <li key={fact} className="sonke-fact-card">
            <p>{fact}</p>
          </li>
        ))}
      </ul>
    </ContentModule>
  );
}

export function DiscoverSection({ data }: { data: GamePageData }) {
  const { game, ai, wikipedia } = data;
  return (
    <ContentModule className="sonke-game-panel" id={`discover-${game.id}`}>
      <h2 className="sonke-section-title">Discover More</h2>
      <p className="sonke-game-description">{ai.description}</p>
      {wikipedia ? (
        <article className="sonke-wiki-card">
          <h3>From Wikipedia: {wikipedia.title}</h3>
          <p>{wikipedia.extract}</p>
          <a href={wikipedia.pageUrl} target="_blank" rel="noreferrer">
            Read more on Wikipedia
          </a>
        </article>
      ) : null}
      <h3 className="sonke-subsection-title">Try These Activities</h3>
      <ul className="sonke-skills">
        {ai.activityIdeas.map((idea) => (
          <li key={idea}>{idea}</li>
        ))}
      </ul>
      <p className="sonke-badge-note">
        Earn the <strong>{data.meta.badgeName}</strong> badge by completing {game.title}!
      </p>
    </ContentModule>
  );
}

export function QuizSection({ data }: { data: GamePageData }) {
  const { game, ai } = data;
  return (
    <ContentModule className="sonke-game-panel" id={`quiz-${game.id}`}>
      <h2 className="sonke-section-title">{game.title} Quiz</h2>
      <div className="sonke-quiz-list">
        {ai.quizQuestions.map((q, index) => (
          <QuizCard key={`${q.question}-${index}`} question={q} index={index} />
        ))}
      </div>
    </ContentModule>
  );
}

function QuizCard({ question, index }: { question: QuizQuestion; index: number }) {
  return (
    <details className="sonke-quiz-card">
      <summary>
        {index + 1}. {question.question}
      </summary>
      <ul>
        {question.options.map((option, optionIndex) => (
          <li
            key={option}
            className={optionIndex === question.answerIndex ? "sonke-quiz-answer" : ""}
          >
            {option}
          </li>
        ))}
      </ul>
    </details>
  );
}

export function RelatedGamesSection({
  title,
  games,
}: {
  title: string;
  games: SonkeGame[];
}) {
  if (games.length === 0) return null;

  return (
    <ContentModule className="sonke-related-module">
      <h2 className="sonke-section-title">{title}</h2>
      <ul className="sonke-related-grid">
        {games.map((related) => (
          <li key={related.id}>
            <Link href={`/games/${related.id}`} className="sonke-related-card MediaItem_mediaLink__JSobH">
              <span className="sonke-related-title MediaItem_heading__AybaX">{related.title}</span>
              <span className="sonke-related-cta">Play</span>
            </Link>
          </li>
        ))}
      </ul>
    </ContentModule>
  );
}

export function RelatedContentSection({ items }: { items: RelatedContentItem[] }) {
  const icons: Record<RelatedContentItem["type"], string> = {
    story: "📖",
    video: "🎬",
    activity: "🎯",
    quiz: "❓",
    article: "📰",
    collection: "📚",
    music: "🎵",
  };

  return (
    <ContentModule className="sonke-related-module">
      <h2 className="sonke-section-title">Related Content</h2>
      <ul className="sonke-content-grid">
        {items.map((item) => (
          <li key={item.title}>
            <Link href={item.href} className="sonke-content-card">
              <span className="sonke-content-icon" aria-hidden="true">{icons[item.type]}</span>
              <div>
                <h3>{item.title}</h3>
                {item.description ? <p>{item.description}</p> : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </ContentModule>
  );
}

export function AdventureBanner({ data }: { data: GamePageData }) {
  return (
    <ContentModule className="sonke-adventure-banner" pattern>
      <h2 className="sonke-section-title">Your Mission</h2>
      <p className="sonke-adventure-text">{data.ai.adventureText}</p>
      <ul className="sonke-objectives">
        <li>Complete the game challenge</li>
        <li>Learn {data.ai.learningGoals.slice(0, 2).join(" & ")}</li>
        <li>Earn the {data.meta.badgeName} badge</li>
      </ul>
    </ContentModule>
  );
}

export function GallerySection({ data }: { data: GamePageData }) {
  if (data.images.gallery.length === 0) return null;

  return (
    <ContentModule className="sonke-gallery-module">
      <h2 className="sonke-section-title">Gallery</h2>
      <div className="sonke-gallery">
        {data.images.gallery.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt={data.game.title} className="sonke-gallery-image" loading="lazy" />
        ))}
      </div>
    </ContentModule>
  );
}
