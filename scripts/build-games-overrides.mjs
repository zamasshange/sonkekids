/**
 * Maps PBS game card slots on home/games pages to Sonke catalog games.
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const catalog = JSON.parse(
  readFileSync(join(root, "content", "sonke-games-catalog.json"), "utf8"),
);

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pick(categoryId, index) {
  const category = catalog.categories.find((c) => c.id === categoryId);
  return category?.games[index]?.title ?? catalog.games[0]?.title;
}

const gamesPageSlots = [
  { pbsSlug: "weather-reporter", pbsTitle: "Weather Reporter", title: pick("puzzle-games", 0), category: "Puzzle Games" },
  { pbsSlug: "seek-the-peak", pbsTitle: "Seek the Peak", title: pick("maze-games", 2), category: "Maze Games" },
  { pbsSlug: "build-a-boat", pbsTitle: "Build-a-Boat", title: pick("puzzle-games", 2), category: "Puzzle Games" },
  { pbsSlug: "super-duper-halo-halo", pbsTitle: "Super Duper Halo-Halo", title: pick("puzzle-games", 3), category: "Puzzle Games" },
  { pbsSlug: "pinkalicious-beach-game", pbsTitle: "Splashtastic Beach Day", title: pick("creative-games", 0), category: "Creative Play" },
  { pbsSlug: "elinor-curious-campout", pbsTitle: "Elinor Curious Campout", title: pick("puzzle-games", 4), category: "Puzzle Games" },
  { pbsSlug: "lyla-stu-stunts", pbsTitle: "Stu's Super Stunts", title: pick("puzzle-games", 5), category: "Puzzle Games" },
  { pbsSlug: "scribbles-and-ink-far-and-away", pbsTitle: "Far and Away", title: pick("creative-games", 1), category: "Creative Play" },
  { pbsSlug: "patternpalooza-fair", pbsTitle: "Pattern Fair", title: pick("puzzle-games", 6), category: "Puzzle Games" },
  { pbsSlug: "archerfish-bug-rush", pbsTitle: "Archerfish Bug Rush", title: pick("puzzle-games", 7), category: "Puzzle Games" },
  { pbsSlug: "reboot-rescue", pbsTitle: "Reboot Rescue", title: pick("maze-games", 0), category: "Maze Games" },
  { pbsSlug: "treeborhood-party-quest", pbsTitle: "Treeborhood Party Quest", title: pick("maze-games", 1), category: "Maze Games" },
  { pbsSlug: "count-y-fair", pbsTitle: "Count-y Fair", title: pick("maze-games", 3), category: "Maze Games" },
  { pbsSlug: "phoebe-signs-seek", pbsTitle: "Signs & Seek", title: pick("maze-games", 4), category: "Maze Games" },
  { pbsSlug: "hero-maker", pbsTitle: "Hero Maker", title: pick("maze-games", 5), category: "Maze Games" },
];

const homePageSlots = gamesPageSlots.slice(0, 10);

const overrideMap = new Map();
for (const slot of gamesPageSlots) {
  overrideMap.set(slot.pbsTitle, slot);
}
for (const slot of homePageSlots) {
  if (!overrideMap.has(slot.pbsTitle)) overrideMap.set(slot.pbsTitle, slot);
}

const overrides = [...overrideMap.values()];

writeFileSync(
  join(root, "content", "games.json"),
  `${JSON.stringify({
    sectionHeadings: [
      { pbsHeading: "Summer Games", title: "Puzzle Games" },
      { pbsHeading: "New Games", title: "Maze Games" },
      { pbsHeading: "Summer Is Here!", title: "Memory Games" },
      { pbsHeading: "New and Popular!", title: "Quiz & Learn" },
      { pbsHeading: "Quizzes", title: "Creative Play" },
    ],
    overrides,
  }, null, 2)}\n`,
  "utf8",
);

const slugMappings = [];
const seenPbsSlugs = new Set();
for (const slot of overrides) {
  if (!slot.pbsSlug || seenPbsSlugs.has(slot.pbsSlug)) continue;
  seenPbsSlugs.add(slot.pbsSlug);
  slugMappings.push({
    pbsSlug: slot.pbsSlug,
    sonkeId: slugify(slot.title),
    title: slot.title,
  });
}

const PBS_SLUG_ALIASES = [
  { pbsSlug: "lyla-in-the-loop-a-stu-of-your-own", sourceSlug: "lyla-stu-stunts" },
  { pbsSlug: "archer-fish-guid", sourceSlug: "archerfish-bug-rush" },
  { pbsSlug: "county-fair", sourceSlug: "count-y-fair" },
  { pbsSlug: "signs-seek", sourceSlug: "phoebe-signs-seek" },
  { pbsSlug: "hamster-water", sourceSlug: "weather-reporter" },
  { pbsSlug: "froyo-stand", sourceSlug: "build-a-boat" },
  { pbsSlug: "weather-explorer", sourceSlug: "seek-the-peak" },
  { pbsSlug: "baby-animals", sourceSlug: "reboot-rescue" },
];

for (const alias of PBS_SLUG_ALIASES) {
  if (seenPbsSlugs.has(alias.pbsSlug)) continue;
  const source = slugMappings.find((item) => item.pbsSlug === alias.sourceSlug);
  if (!source) continue;
  seenPbsSlugs.add(alias.pbsSlug);
  slugMappings.push({
    pbsSlug: alias.pbsSlug,
    sonkeId: source.sonkeId,
    title: source.title,
  });
}

for (const game of catalog.games) {
  slugMappings.push({ pbsSlug: game.id, sonkeId: game.id, title: game.title });
}

writeFileSync(
  join(root, "content", "games-slug-map.json"),
  `${JSON.stringify(slugMappings, null, 2)}\n`,
  "utf8",
);

console.log(`Wrote ${overrides.length} game slot overrides.`);
console.log(`Wrote ${slugMappings.length} slug mappings.`);
