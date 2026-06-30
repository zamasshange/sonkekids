import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { PbsSlugMapping } from "./types";

let cachedMap: Record<string, string> | null = null;

export function loadPbsSlugMap(): Record<string, string> {
  if (cachedMap) return cachedMap;

  const path = join(process.cwd(), "content", "games-slug-map.json");
  if (!existsSync(path)) {
    cachedMap = {};
    return cachedMap;
  }

  const mappings = JSON.parse(readFileSync(path, "utf8")) as PbsSlugMapping[];
  cachedMap = Object.fromEntries(mappings.map((item) => [item.pbsSlug, item.sonkeId]));
  return cachedMap;
}

export function getSonkeIdForPbsSlug(pbsSlug: string): string | undefined {
  return loadPbsSlugMap()[pbsSlug];
}
