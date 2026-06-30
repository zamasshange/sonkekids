/**
 * Build Sonke catalog from PrimaryGames + LogicLike curated sources.
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const PG_ORIGIN = "https://www.primarygames.com";

const primarySource = JSON.parse(
  readFileSync(join(root, "content", "primarygames-source.json"), "utf8"),
);
const logiclikeSource = JSON.parse(
  readFileSync(join(root, "content", "logiclike-source.json"), "utf8"),
);

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const PG_CDN_HOST = "cdn.primarygames.com";

function isLocalPrimaryEmbed(embedUrl) {
  try {
    const parsed = new URL(embedUrl);
    return parsed.hostname === PG_CDN_HOST && parsed.pathname.includes("/HTML5/");
  } catch {
    return false;
  }
}

async function fetchPrimaryEmbedUrl(pageUrl) {
  const res = await fetch(pageUrl, {
    headers: { "User-Agent": "SonkeKidsCatalog/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const match = html.match(/gameURL\s*=\s*['"]([^'"]+)['"]/);
  if (!match) throw new Error("gameURL not found");
  return match[1];
}

function primaryLogoUrl(path) {
  return `${PG_ORIGIN}/${path}/logo200.png`;
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current], current);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const flat = [];

console.log("PrimaryGames…");
for (const category of primarySource.categories) {
  const entries = category.games.map((game) => ({
    ...game,
    categoryId: category.id,
    category: category.title,
    pageUrl: `${PG_ORIGIN}/${game.path}/`,
    id: slugify(game.title),
  }));

  const resolved = await mapWithConcurrency(entries, 4, async (entry) => {
    try {
      const embedUrl = await fetchPrimaryEmbedUrl(entry.pageUrl);
      if (!isLocalPrimaryEmbed(embedUrl)) {
        console.warn(`  ✗ ${entry.title}: external or non-HTML5 embed (${embedUrl})`);
        return null;
      }
      process.stdout.write(`  ✓ ${entry.title}\n`);
      return {
        id: entry.id,
        title: entry.title,
        categoryId: entry.categoryId,
        category: entry.category,
        embedUrl,
        thumbnailUrl: primaryLogoUrl(entry.path),
        sourceUrl: entry.pageUrl,
        embedSource: "primarygames",
      };
    } catch (error) {
      console.warn(`  ✗ ${entry.title}: ${error.message}`);
      return null;
    }
  });

  for (const game of resolved.filter(Boolean)) {
    flat.push(game);
  }
}

console.log("LogicLike…");
const llOrigin = logiclikeSource.origin;

for (const category of logiclikeSource.categories) {
  for (const game of category.games) {
    const id = slugify(game.title);
    let embedUrl;
    let sourceUrl;

    if (game.exercisePath) {
      embedUrl = `${llOrigin}/en/v3/cabinet/exercise/${game.exercisePath}`;
      sourceUrl = embedUrl;
    } else {
      embedUrl = `${llOrigin}/static/games/${game.staticPath}/index.html`;
      sourceUrl = `${llOrigin}/en/game/${game.gameName}`;
    }

    flat.push({
      id,
      title: game.title,
      categoryId: category.id,
      category: category.title,
      embedUrl,
      thumbnailUrl: game.thumbnail,
      sourceUrl,
      embedSource: "logiclike",
      topicLabel: game.topicLabel ?? game.title,
    });
    process.stdout.write(`  ✓ ${game.title}\n`);
  }
}

if (flat.length === 0) {
  throw new Error("No games resolved — check network or source files.");
}

const categoryOrder = [
  ...primarySource.categories.map((c) => c.id),
  ...logiclikeSource.categories.map((c) => c.id),
];
const categoryMeta = new Map([
  ...primarySource.categories.map((c) => [c.id, c.title]),
  ...logiclikeSource.categories.map((c) => [c.id, c.title]),
]);

const categories = categoryOrder
  .filter((id, index, all) => all.indexOf(id) === index)
  .map((id) => ({
    id,
    title: categoryMeta.get(id) ?? id,
    count: flat.filter((game) => game.categoryId === id).length,
    games: flat
      .filter((game) => game.categoryId === id)
      .map((game) => ({ id: game.id, title: game.title })),
  }))
  .filter((category) => category.count > 0);

const output = {
  version: 4,
  sources: ["primarygames", "logiclike"],
  totalGames: flat.length,
  totalCategories: categories.length,
  categories,
  games: flat,
};

writeFileSync(
  join(root, "content", "sonke-games-catalog.json"),
  `${JSON.stringify(output, null, 2)}\n`,
  "utf8",
);

console.log(
  `Wrote ${output.totalGames} games in ${output.totalCategories} categories (PrimaryGames + LogicLike).`,
);
