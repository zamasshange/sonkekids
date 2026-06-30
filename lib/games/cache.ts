import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { GamePageData } from "./types";

const CACHE_DIR = join(process.cwd(), "data", "game-pages");

export function getGameCachePath(slug: string) {
  return join(CACHE_DIR, `${slug}.json`);
}

export function readCachedGamePage(slug: string): GamePageData | null {
  const path = getGameCachePath(slug);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as GamePageData;
  } catch {
    return null;
  }
}

export function writeCachedGamePage(slug: string, data: GamePageData) {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(getGameCachePath(slug), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
