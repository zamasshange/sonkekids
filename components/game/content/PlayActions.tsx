"use client";

type PlayActionsProps = {
  gameId: string;
  title: string;
};

export function PlayActions({ gameId, title }: PlayActionsProps) {
  const playHref = `/games/${gameId}/play`;

  function handleFavorite() {
    try {
      const key = "sonke-favorites";
      const existing = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
      const next = existing.includes(gameId)
        ? existing.filter((id) => id !== gameId)
        : [...existing, gameId];
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function handleShare() {
    const url = `${window.location.origin}/games/${gameId}`;
    if (navigator.share) {
      void navigator.share({ title, url });
    } else {
      void navigator.clipboard.writeText(url);
    }
  }

  return (
    <div className="sonke-play-actions">
      <a href={playHref} className="sonke-btn sonke-btn-play">
        Play {title}
      </a>
      <button type="button" className="sonke-btn sonke-btn-secondary" onClick={handleFavorite}>
        Favorite
      </button>
      <button type="button" className="sonke-btn sonke-btn-secondary" onClick={handleShare}>
        Share
      </button>
    </div>
  );
}
