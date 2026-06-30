"use client";

type ExternalGameEmbedProps = {
  title: string;
  embedUrl: string;
  sourceUrl?: string | null;
  embedSource?: "primarygames" | "logiclike";
  topicLabel?: string | null;
};

export function ExternalGameEmbed({
  title,
  embedUrl,
  topicLabel,
}: ExternalGameEmbedProps) {
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
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups allow-modals"
      />
    </div>
  );
}

/** @deprecated Use ExternalGameEmbed */
export const PrimaryGamesEmbed = ExternalGameEmbed;
