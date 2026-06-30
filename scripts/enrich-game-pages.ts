/**
 * Enrich game pages with Wikipedia + OpenRouter content.
 * Usage: npm run enrich-games -- --limit=20 --slug=animal-match
 */
import { readFileSync } from "fs";
import { join } from "path";
import { enrichGamePage } from "../lib/games/enrich";
import type { SonkeCatalog } from "../lib/games/types";

const root = process.cwd();
const catalog = JSON.parse(
  readFileSync(join(root, "content", "sonke-games-catalog.json"), "utf8"),
) as SonkeCatalog;

const args = process.argv.slice(2);
const limitArg = args.find((arg) => arg.startsWith("--limit="));
const slugArg = args.find((arg) => arg.startsWith("--slug="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : catalog.games.length;
const onlySlug = slugArg ? slugArg.split("=")[1] : null;

const targets = onlySlug
  ? catalog.games.filter((game) => game.id === onlySlug)
  : catalog.games.slice(0, limit);

console.log(`Enriching ${targets.length} game pages...`);

for (const [index, game] of targets.entries()) {
  process.stdout.write(`[${index + 1}/${targets.length}] ${game.id}... `);
  try {
    await enrichGamePage(game.id, { force: true });
    console.log("done");
  } catch (error) {
    console.log("failed", error instanceof Error ? error.message : error);
  }
  await new Promise((resolve) => setTimeout(resolve, 1200));
}

console.log("Enrichment complete.");
