import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { resolveSonkeGameId } from "./resolve-slug";

type PlayIndexEntry = {
  pbsSlug: string;
  pbsId: string;
  sonkeId: string;
  title: string;
  playUrl: string;
  file: string;
};

let cachedEntries: PlayIndexEntry[] | null = null;

function loadPlayIndex(): PlayIndexEntry[] {
  if (cachedEntries) return cachedEntries;

  const indexPath = join(process.cwd(), "public", "pbs", "play", "index.json");
  if (!existsSync(indexPath)) {
    cachedEntries = [];
    return cachedEntries;
  }

  cachedEntries = JSON.parse(readFileSync(indexPath, "utf8")) as PlayIndexEntry[];
  return cachedEntries;
}

const BY_SONKE_ID = () => {
  const map = new Map<string, PlayIndexEntry>();
  for (const entry of loadPlayIndex()) {
    map.set(entry.sonkeId, entry);
  }
  return map;
};

const BY_PBS_SLUG = () => {
  const map = new Map<string, PlayIndexEntry>();
  for (const entry of loadPlayIndex()) {
    if (!map.has(entry.pbsSlug)) {
      map.set(entry.pbsSlug, entry);
    }
  }
  return map;
};

export function getPlayIndex(): PlayIndexEntry[] {
  return loadPlayIndex();
}

export function getPlayEntryBySonkeId(sonkeId: string): PlayIndexEntry | null {
  return BY_SONKE_ID().get(sonkeId) ?? null;
}

export function getPlayEntryByPbsSlug(pbsSlug: string): PlayIndexEntry | null {
  const mapped = BY_PBS_SLUG().get(pbsSlug);
  if (mapped) return mapped;
  const sonkeId = resolveSonkeGameId(pbsSlug);
  return sonkeId ? BY_SONKE_ID().get(sonkeId) ?? null : null;
}

export function getPlayUrlForSonkeGame(sonkeId: string): string | null {
  return getPlayEntryBySonkeId(sonkeId)?.playUrl ?? null;
}

export function getCachedPlayHtmlPath(pbsSlug: string, pbsId?: string): string | null {
  const entry = getPlayEntryByPbsSlug(pbsSlug);
  if (!entry) return null;

  const id = pbsId ?? entry.pbsId;
  const file = id === entry.pbsId ? entry.file : `${pbsSlug}-${id}.html`;

  const diskPath = join(process.cwd(), "public", "pbs", "play", file);
  return existsSync(diskPath) ? diskPath : null;
}
