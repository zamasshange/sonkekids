import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { buildReplacementRules, applyRulesToString } from "./sonke-content-rules.mjs";

const URL_PATTERN = /(?:https?:\/\/|\/pbs-assets\/|\/_next\/)[^\s"'<>]+/g;

function readJson(path) {
  if (!existsSync(path)) {
    return null;
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

export function loadSonkeContent(contentDir) {
  const terminology = readJson(join(contentDir, "terminology.json")) ?? {
    replacements: [],
  };
  const propertyMap = readJson(join(contentDir, "property-map.json")) ?? {};
  const worlds = readJson(join(contentDir, "worlds.json")) ?? [];
  const games = readJson(join(contentDir, "games.json")) ?? { overrides: [] };
  const videos = readJson(join(contentDir, "videos.json")) ?? { overrides: [] };

  const worldById = new Map(worlds.map((world) => [world.id, world]));
  const rules = buildReplacementRules({
    terminology,
    propertyMap,
    games,
    videos,
  });

  return {
    terminology,
    propertyMap,
    worlds,
    worldById,
    games,
    videos,
    rules,
  };
}

function protectUrls(text) {
  const urls = [];

  const protectedText = text.replace(URL_PATTERN, (url) => {
    const index = urls.length;
    urls.push(url);
    return `__SONKE_URL_${index}__`;
  });

  return { protectedText, urls };
}

function restoreUrls(text, urls) {
  return text.replace(/__SONKE_URL_(\d+)__/g, (_, index) => urls[Number(index)]);
}

export function applySonkeContent(text, content) {
  const { protectedText, urls } = protectUrls(text);
  const updated = applyRulesToString(protectedText, content.rules);
  return restoreUrls(updated, urls);
}

export function summarizeSonkeContent(content) {
  return {
    worlds: content.worlds.length,
    propertyMappings: Object.keys(content.propertyMap).length,
    gameOverrides: content.games.overrides.length,
    videoOverrides: content.videos.overrides.length,
    terminologyRules: content.terminology.replacements.length,
    replacementRules: content.rules.length,
  };
}

export { buildReplacementRules };
