"use client";

import { useMemo, useState } from "react";

const EMOJIS = ["🐶", "🐱", "🐰", "🦊", "🐻", "🐼"];

export function MatchPlayer({ title }: { title: string }) {
  const deck = useMemo(() => {
    const pairs = EMOJIS.slice(0, 4).flatMap((emoji, index) => [
      { id: `${emoji}-${index}-a`, emoji },
      { id: `${emoji}-${index}-b`, emoji },
    ]);
    return pairs.sort(() => Math.random() - 0.5);
  }, []);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [message, setMessage] = useState(`Match pairs in ${title}!`);

  function handleFlip(id: string, emoji: string) {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(emoji)) return;

    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      const first = deck.find((card) => card.id === next[0]);
      const second = deck.find((card) => card.id === next[1]);
      if (first && second && first.emoji === second.emoji) {
        setMatched((prev) => [...prev, first.emoji]);
        setMessage("Great match!");
        setFlipped([]);
      } else {
        setMessage("Try again!");
        setTimeout(() => setFlipped([]), 700);
      }
    }
  }

  const won = matched.length === 4;

  return (
    <div className="player-shell">
      <p className="player-message">{won ? "You matched them all!" : message}</p>
      <div className="match-grid">
        {deck.map((card) => {
          const isOpen = flipped.includes(card.id) || matched.includes(card.emoji);
          return (
            <button
              key={card.id}
              type="button"
              className={`match-card${isOpen ? " is-open" : ""}`}
              onClick={() => handleFlip(card.id, card.emoji)}
              aria-label={isOpen ? card.emoji : "hidden card"}
            >
              {isOpen ? card.emoji : "?"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
