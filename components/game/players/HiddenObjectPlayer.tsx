"use client";

import { useState } from "react";

const ITEMS = [
  { id: "star", label: "Star", x: "18%", y: "22%" },
  { id: "rocket", label: "Rocket", x: "68%", y: "28%" },
  { id: "fish", label: "Fish", x: "42%", y: "62%" },
];

export function HiddenObjectPlayer({ title }: { title: string }) {
  const [found, setFound] = useState<string[]>([]);

  return (
    <div className="player-shell">
      <p className="player-message">
        {found.length === ITEMS.length
          ? "You found everything!"
          : `Tap the hidden objects in ${title}.`}
      </p>
      <div className="hidden-scene">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`hidden-item${found.includes(item.id) ? " is-found" : ""}`}
            style={{ left: item.x, top: item.y }}
            onClick={() => setFound((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]))}
          >
            {found.includes(item.id) ? "✓" : "?"}
          </button>
        ))}
      </div>
      <ul className="hidden-checklist">
        {ITEMS.map((item) => (
          <li key={item.id} className={found.includes(item.id) ? "done" : ""}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
