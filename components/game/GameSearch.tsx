"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SearchResult } from "@/lib/games/types";

type GameSearchProps = {
  initialQuery?: string;
  index: SearchResult[];
};

const TYPE_LABELS: Record<SearchResult["type"], string> = {
  game: "Game",
  fact: "Fact",
  activity: "Activity",
  quiz: "Quiz",
};

function filterResults(index: SearchResult[], query: string, limit = 24): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = index
    .map((entry) => {
      const haystack = `${entry.title} ${entry.category} ${entry.snippet} ${entry.tags.join(" ")}`.toLowerCase();
      let score = 0;
      if (entry.title.toLowerCase().includes(q)) score += 10;
      if (entry.category.toLowerCase().includes(q)) score += 6;
      if (haystack.includes(q)) score += 4;
      for (const word of q.split(/\s+/)) {
        if (word.length > 2 && haystack.includes(word)) score += 2;
      }
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const { entry } of scored) {
    if (seen.has(entry.id)) continue;
    seen.add(entry.id);
    results.push(entry);
    if (results.length >= limit) break;
  }
  return results;
}

export function GameSearch({ initialQuery = "", index }: GameSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => filterResults(index, query), [index, query]);

  return (
    <div className="sonke-search">
      <label htmlFor="game-search" className="sr-only">
        Search games, facts, and activities
      </label>
      <input
        id="game-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search games, facts, dinosaurs, ocean..."
        className="sonke-search-input"
        autoFocus={Boolean(initialQuery)}
      />

      {query.trim() && results.length === 0 ? (
        <p className="sonke-search-empty">No results for &ldquo;{query}&rdquo;. Try another word!</p>
      ) : null}

      {results.length > 0 ? (
        <ul className="sonke-search-results">
          {results.map((result) => (
            <li key={result.id}>
              <Link href={result.href} className="sonke-search-result">
                <span className="sonke-search-type">{TYPE_LABELS[result.type]}</span>
                <div>
                  <h3>{result.title}</h3>
                  <p>{result.snippet}</p>
                  <span className="sonke-search-category">{result.category}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
