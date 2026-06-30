"use client";

type ExternalGameEmbedProps = {
  title: string;
  embedUrl: string;
  sourceUrl: string | null;
  embedSource?: "primarygames" | "logiclike";
  topicLabel?: string | null;
};

export function ExternalGameEmbed({
  title,
  embedUrl,
  sourceUrl,
  embedSource = "primarygames",
  topicLabel,
}: ExternalGameEmbedProps) {
  const partner = embedSource === "logiclike" ? "LogicLike" : "PrimaryGames";

  return (
    <div className="sonke-pg-embed">
      {topicLabel ? (
        <p className="sonke-pg-embed-topic" aria-live="polite">
          {topicLabel}
        </p>
      ) : null}
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
          Open on {partner} if the game does not load
        </a>
      ) : null}
    </div>
  );
}

/** @deprecated Use ExternalGameEmbed */
export const PrimaryGamesEmbed = ExternalGameEmbed;
