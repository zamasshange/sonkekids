"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { GamePageData } from "@/lib/games/types";
import { getHeroVisual } from "@/lib/games/images";
import { SONKE_LOGO_SVG } from "@/lib/sonke-branding";
import { GamePlayer } from "./players/GamePlayer";
import { ExternalGameEmbed } from "./ExternalGameEmbed";
import "./sonke-play-shell.css";

type PlayPhase = "splash" | "playing";

type AudioSettings = {
  mainSound: boolean;
  music: boolean;
  sfx: boolean;
  captions: boolean;
};

type SonkePlayShellProps = {
  data: GamePageData;
};

export function SonkePlayShell({ data }: SonkePlayShellProps) {
  const { game, gameType, ai, heroImage, embedUrl, sourceUrl, embedSource, topicLabel } = data;
  const visual = getHeroVisual(game, heroImage);
  const stageRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<PlayPhase>("splash");
  const [settings, setSettings] = useState<AudioSettings>({
    mainSound: true,
    music: true,
    sfx: true,
    captions: false,
  });

  const toggleSetting = (key: keyof AudioSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const startGame = () => setPhase("playing");

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      void el.requestFullscreen?.();
    } else {
      void document.exitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && phase === "playing") {
        setPhase("splash");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const backgroundStyle = {
    background: `linear-gradient(180deg, ${visual.gradient[0]} 0%, ${visual.gradient[1]} 55%, #99cf16 100%)`,
  };

  return (
    <div className="sonke-play-page" style={backgroundStyle}>
      <div className="sonke-play-sky" aria-hidden="true" />
      <div className="sonke-play-hills" aria-hidden="true" />

      <header className="sonke-play-header">
        <Link href={`/games/${game.id}`} className="sonke-play-back" aria-label="Back to game page">
          <span aria-hidden="true">‹</span>
        </Link>
        <Link href="/" className="sonke-play-logo" aria-label="Sonke Kids home">
          <div dangerouslySetInnerHTML={{ __html: SONKE_LOGO_SVG }} />
        </Link>
        <nav className="sonke-play-nav" aria-label="Site">
          <Link href="/games" className="sonke-play-nav-btn sonke-play-nav-games">
            Games
          </Link>
          <Link href="/videos" className="sonke-play-nav-btn sonke-play-nav-videos">
            Videos
          </Link>
        </nav>
      </header>

      <main className="sonke-play-main">
        <div ref={stageRef} className="sonke-play-stage">
          <div className="sonke-play-stage-top">
            <button
              type="button"
              className="sonke-play-big-btn"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
            >
              <span className="sonke-play-big-icon" aria-hidden="true">⛶</span>
              <span>BIG</span>
            </button>
            <Link
              href={`/games/${game.id}`}
              className="sonke-play-exit"
              aria-label="Exit game"
            >
              ‹
            </Link>
          </div>

          {phase === "splash" ? (
            <div className="sonke-play-splash">
              {visual.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={visual.image}
                  alt=""
                  className="sonke-play-splash-art"
                />
              ) : (
                <div className="sonke-play-splash-emoji" aria-hidden="true">
                  {visual.emoji}
                </div>
              )}
              <h1 className="sonke-play-title">{game.title}</h1>
              <p className="sonke-play-tagline">{ai.tagline}</p>
              <button type="button" className="sonke-play-start-btn" onClick={startGame}>
                <span className="sonke-play-start-icon" aria-hidden="true">▶</span>
                PLAY GAME
              </button>
            </div>
          ) : (
            <div className="sonke-play-active">
              <h2 className="sonke-play-active-title">
                {topicLabel ?? game.title}
              </h2>
              <div className={`sonke-play-frame${embedUrl ? " sonke-play-frame-embed" : ""}`}>
                {embedUrl ? (
                  <ExternalGameEmbed
                    title={game.title}
                    embedUrl={embedUrl}
                    sourceUrl={sourceUrl}
                    embedSource={embedSource ?? game.embedSource}
                    topicLabel={embedSource === "logiclike" || game.embedSource === "logiclike" ? topicLabel : null}
                  />
                ) : (
                  <GamePlayer title={game.title} gameType={gameType} />
                )}
              </div>
              {settings.captions && (
                <p className="sonke-play-caption">{ai.tips[0]}</p>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="sonke-play-footer">
        <div className="sonke-play-settings" role="group" aria-label="Game settings">
          <SettingToggle
            label="Main Sound"
            active={settings.mainSound}
            onClick={() => toggleSetting("mainSound")}
            icon="🔊"
          />
          <SettingToggle
            label="Closed Captions"
            active={settings.captions}
            onClick={() => toggleSetting("captions")}
            icon="CC"
          />
          <SettingToggle
            label="Music"
            active={settings.music}
            onClick={() => toggleSetting("music")}
            icon="♫"
          />
          <SettingToggle
            label="Sound Effects"
            active={settings.sfx}
            onClick={() => toggleSetting("sfx")}
            icon="🥁"
          />
        </div>
        <p className="sonke-play-credits">
          Sonke Kids · {game.category} · Ages {data.meta.ageMin}–{data.meta.ageMax}
          {embedUrl && sourceUrl ? (
            <>
              {" · "}
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sonke-play-attribution"
              >
                Game by {embedSource === "logiclike" || game.embedSource === "logiclike" ? "LogicLike" : "PrimaryGames"}
              </a>
            </>
          ) : null}
        </p>
      </footer>
    </div>
  );
}

function SettingToggle({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: string;
}) {
  return (
    <button
      type="button"
      className={`sonke-play-setting${active ? "" : " sonke-play-setting-off"}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="sonke-play-setting-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="sonke-play-setting-label">{label}</span>
    </button>
  );
}
