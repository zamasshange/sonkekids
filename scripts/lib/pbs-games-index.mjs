import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");

/** @typedef {{ id: string, slug: string, title: string }} PbsGameEntry */

/** @returns {Map<string, PbsGameEntry>} */
export function loadPbsGameIndex() {
  const dataPath = join(root, "public", "pbs", "data", "games.json");
  const data = JSON.parse(readFileSync(dataPath, "utf8"));
  /** @type {Map<string, PbsGameEntry>} */
  const bySlug = new Map();

  function walk(obj) {
    if (!obj || typeof obj !== "object") return;
    if (
      obj.slug &&
      obj.id &&
      obj.title &&
      typeof obj.slug === "string" &&
      !obj.slug.startsWith("__")
    ) {
      bySlug.set(obj.slug, {
        id: String(obj.id),
        slug: obj.slug,
        title: String(obj.title),
      });
    }
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object") walk(value);
    }
  }

  walk(data);
  return bySlug;
}

/** PBS play URLs use the first mapping entry per pbs slug (not catalog self-maps). */
export function loadPbsPlayTargets() {
  const mappings = JSON.parse(
    readFileSync(join(root, "content", "games-slug-map.json"), "utf8"),
  );
  const gameIndex = loadPbsGameIndex();
  const seen = new Set();
  const targets = [];

  for (const item of mappings) {
    if (seen.has(item.pbsSlug)) continue;
    if (item.pbsSlug === item.sonkeId) continue;
    seen.add(item.pbsSlug);

    const game = gameIndex.get(item.pbsSlug);
    if (!game) {
      continue;
    }

    targets.push({
      pbsSlug: item.pbsSlug,
      pbsId: game.id,
      sonkeId: item.sonkeId,
      title: item.title,
      playUrl: `/games/play/${item.pbsSlug}/${game.id}`,
    });
  }

  return targets;
}

export function playPageFileName(pbsSlug, pbsId) {
  return `${pbsSlug}-${pbsId}.html`;
}

export function playPagePath(pbsSlug, pbsId) {
  return join(root, "public", "pbs", "play", playPageFileName(pbsSlug, pbsId));
}
