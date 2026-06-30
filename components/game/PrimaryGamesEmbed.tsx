"use client";

type PrimaryGamesEmbedProps = {
  title: string;
  embedUrl: string;
  sourceUrl: string | null;
};

export function PrimaryGamesEmbed({ title, embedUrl, sourceUrl }: PrimaryGamesEmbedProps) {
  return (
    <div className="sonke-pg-embed">
      <iframe
        title={title}
        src={embedUrl}
        className="sonke-pg-embed-frame"
        allow="autoplay; fullscreen; gamepad"
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sonke-pg-embed-fallback"
        >
          Open on PrimaryGames if the game does not load
        </a>
      ) : null}
    </div>
  );
}
