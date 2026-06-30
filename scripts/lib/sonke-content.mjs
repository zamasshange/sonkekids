import { existsSync, readFileSync } from "fs";
import { join } from "path";

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

  return {
    terminology,
    propertyMap,
    worlds,
    worldById,
    games,
    videos,
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

function applyReplacements(text, replacements) {
  let updated = text;
  const sorted = [...replacements].sort((a, b) => b[0].length - a[0].length);

  for (const [from, to] of sorted) {
    updated = updated.replaceAll(from, to);
  }

  return updated;
}

function applyPropertyMap(text, propertyMap) {
  let updated = text;

  for (const mapping of Object.values(propertyMap)) {
    if (!mapping.pbsTitle || !mapping.worldTitle) {
      continue;
    }

    const variants = new Set([
      mapping.pbsTitle,
      mapping.pbsTitle.replace(/'/g, "\u2019"),
      mapping.pbsTitle.replace(/&/g, "&amp;"),
    ]);

    for (const variant of variants) {
      updated = updated.replaceAll(variant, mapping.worldTitle);
    }
  }

  return updated;
}

function applyContentOverrides(text, overrides) {
  let updated = text;

  for (const item of overrides) {
    if (item.pbsTitle && item.title) {
      updated = updated.replaceAll(item.pbsTitle, item.title);
    }
    if (item.pbsAlt && item.alt) {
      updated = updated.replaceAll(item.pbsAlt, item.alt);
    }
  }

  return updated;
}

export function applySonkeContent(text, content) {
  const { protectedText, urls } = protectUrls(text);
  let updated = protectedText;
  updated = applyPropertyMap(updated, content.propertyMap);
  updated = applyContentOverrides(updated, content.games.overrides);
  updated = applyContentOverrides(updated, content.videos.overrides);
  updated = applyReplacements(updated, content.terminology.replacements);
  return restoreUrls(updated, urls);
}

export function summarizeSonkeContent(content) {
  return {
    worlds: content.worlds.length,
    propertyMappings: Object.keys(content.propertyMap).length,
    gameOverrides: content.games.overrides.length,
    videoOverrides: content.videos.overrides.length,
    terminologyRules: content.terminology.replacements.length,
  };
}
