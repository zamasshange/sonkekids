import type { GamePageData } from "@/lib/games/types";
import { SonkePbsPage } from "../SonkePbsPage";
import {
  AdventureBanner,
  ContentModule,
  DiscoverSection,
  FunFactsSection,
  GallerySection,
  GameHero,
  GamePlaySection,
  HowToPlaySection,
  LearningSection,
  QuizSection,
  RelatedContentSection,
  RelatedGamesSection,
} from "../content/shared";

export function TemplateA({ data }: { data: GamePageData }) {
  return (
    <SonkePbsPage pageTitle={data.game.title}>
      <ContentModule className="sonke-game-hero-module">
        <GameHero data={data} />
      </ContentModule>
      <GamePlaySection data={data} />
      <div className="sonke-game-columns">
        <HowToPlaySection data={data} />
        <LearningSection data={data} />
      </div>
      <DiscoverSection data={data} />
      <FunFactsSection data={data} />
      <RelatedGamesSection title={`More ${data.game.category}`} games={data.suggestedGames} />
      <RelatedContentSection items={data.relatedContent} />
    </SonkePbsPage>
  );
}

export function TemplateB({ data }: { data: GamePageData }) {
  return (
    <SonkePbsPage pageTitle={data.game.title}>
      <ContentModule className="sonke-game-hero-module">
        <GameHero data={data} large />
      </ContentModule>
      <GamePlaySection data={data} />
      <FunFactsSection data={data} />
      <GallerySection data={data} />
      <div className="sonke-game-columns">
        <LearningSection data={data} />
        <DiscoverSection data={data} />
      </div>
      <RelatedGamesSection title="You Might Also Like" games={data.suggestedGames} />
    </SonkePbsPage>
  );
}

export function TemplateC({ data }: { data: GamePageData }) {
  return (
    <SonkePbsPage pageTitle={data.game.title}>
      <div className="sonke-split-layout">
        <div className="sonke-split-main">
          <ContentModule className="sonke-game-hero-module">
            <GameHero data={data} />
          </ContentModule>
          <GamePlaySection data={data} />
          <QuizSection data={data} />
        </div>
        <aside className="sonke-split-sidebar">
          <HowToPlaySection data={data} />
          <LearningSection data={data} />
          <RelatedContentSection items={data.relatedContent.slice(0, 3)} />
        </aside>
      </div>
      <DiscoverSection data={data} />
      <RelatedGamesSection title={`Discover More ${data.game.category}`} games={data.suggestedGames} />
    </SonkePbsPage>
  );
}

export function TemplateD({ data }: { data: GamePageData }) {
  return (
    <SonkePbsPage pageTitle={data.game.title}>
      <AdventureBanner data={data} />
      <ContentModule className="sonke-game-hero-module">
        <GameHero data={data} />
      </ContentModule>
      <GamePlaySection data={data} />
      <div className="sonke-game-columns">
        <FunFactsSection data={data} />
        <HowToPlaySection data={data} />
      </div>
      <LearningSection data={data} />
      <RelatedGamesSection title="Continue Your Adventure" games={data.suggestedGames} />
      <RelatedContentSection items={data.relatedContent} />
    </SonkePbsPage>
  );
}
