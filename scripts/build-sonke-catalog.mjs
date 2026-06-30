/**
 * Build Sonke catalog from curated PrimaryGames HTML5 titles.
 * Fetches each game's CDN embed URL from its PrimaryGames page.
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const PG_ORIGIN = "https://www.primarygames.com";

const source = JSON.parse(
  readFileSync(join(root, "content", "primarygames-source.json"), "utf8"),
);

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchEmbedUrl(pageUrl) {
  const res = await fetch(pageUrl, {
    headers: { "User-Agent": "SonkeKidsCatalog/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const match = html.match(/gameURL\s*=\s*['"]([^'"]+)['"]/);
  if (!match) throw new Error("gameURL not found");
  return match[1];
}

function logoUrl(path) {
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

for (const category of source.categories) {
  const entries = category.games.map((game) => ({
    ...game,
    categoryId: category.id,
    category: category.title,
    pageUrl: `${PG_ORIGIN}/${game.path}/`,
    id: slugify(game.title),
  }));

  const resolved = await mapWithConcurrency(entries, 4, async (entry) => {
    try {
      const embedUrl = await fetchEmbedUrl(entry.pageUrl);
      process.stdout.write(`  ✓ ${entry.title}\n`);
      return {
        id: entry.id,
        title: entry.title,
        categoryId: entry.categoryId,
        category: entry.category,
        embedUrl,
        thumbnailUrl: logoUrl(entry.path),
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

if (flat.length === 0) {
  throw new Error("No games resolved — check network or PrimaryGames HTML format.");
}

const categories = source.categories.map((category) => ({
  id: category.id,
  title: category.title,
  count: flat.filter((game) => game.categoryId === category.id).length,
  games: flat
    .filter((game) => game.categoryId === category.id)
    .map((game) => ({ id: game.id, title: game.title })),
}));

const output = {
  version: 3,
  source: "primarygames",
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

console.log(`Wrote ${output.totalGames} PrimaryGames embeds in ${output.totalCategories} categories.`);
