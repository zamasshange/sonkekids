import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { SonkeCatalog, SonkeGame } from "./types";

let cachedCatalog: SonkeCatalog | null = null;

export function getCatalogPath() {
  return join(process.cwd(), "content", "sonke-games-catalog.json");
}

export function loadCatalog(): SonkeCatalog {
  if (cachedCatalog) return cachedCatalog;
  const path = getCatalogPath();
  if (!existsSync(path)) {
    throw new Error("Missing content/sonke-games-catalog.json — run npm run build-content");
  }
  cachedCatalog = JSON.parse(readFileSync(path, "utf8")) as SonkeCatalog;
  return cachedCatalog;
}

export function getGameById(id: string): SonkeGame | undefined {
  return loadCatalog().games.find((game) => game.id === id);
}

export function getAllGameIds(): string[] {
  return loadCatalog().games.map((game) => game.id);
}

export function getRelatedGames(game: SonkeGame, limit = 6): SonkeGame[] {
  return loadCatalog().games
    .filter((item) => item.categoryId === game.categoryId && item.id !== game.id)
    .slice(0, limit);
}

export function titleToId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
