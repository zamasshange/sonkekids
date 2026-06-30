/**
 * Maps PBS game card slots on home/games pages to Sonke catalog games.
 * Each PBS slug gets a unique catalog title; home-only PBS titles use pbsTitleAlt.
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

const catalogGames = catalog.games;
let assignIndex = 0;

function assignGame() {
  const game = catalogGames[assignIndex % catalogGames.length];
  assignIndex += 1;
  return game;
}

/** Games page collage slots (from raw PBS HTML). */
const gamesPageSlots = [
  { pbsSlug: "weather-reporter", pbsTitle: "Weather Reporter", categoryId: "puzzle-games" },
  { pbsSlug: "seek-the-peak", pbsTitle: "Seek the Peak", categoryId: "arcade-games" },
  { pbsSlug: "build-a-boat", pbsTitle: "Build-a-Boat", categoryId: "puzzle-games" },
  { pbsSlug: "super-duper-halo-halo", pbsTitle: "Super Duper Halo-Halo", categoryId: "logic-games" },
  { pbsSlug: "pinkalicious-beach-game", pbsTitle: "Splashtastic Beach Day", categoryId: "math-games" },
  { pbsSlug: "elinor-curious-campout", pbsTitle: "Elinor Curious Campout", categoryId: "puzzle-games" },
  { pbsSlug: "lyla-in-the-loop-a-stu-of-your-own", pbsTitle: "Stu's Super Stunts", categoryId: "sports-games" },
  { pbsSlug: "scribbles-and-ink-far-and-away", pbsTitle: "Scribbles and Ink: Far and Away", categoryId: "arcade-games" },
  { pbsSlug: "patternpalooza-fair", pbsTitle: "Patternpalooza Fair", categoryId: "logic-games" },
  { pbsSlug: "archer-fish-guid", pbsTitle: "Archerfish Bug Rush", categoryId: "puzzle-games" },
  { pbsSlug: "reboot-rescue", pbsTitle: "Reboot Rescue", categoryId: "arcade-games" },
  { pbsSlug: "treeborhood-party-quest", pbsTitle: "Treeborhood Party Quest", categoryId: "logic-games" },
  { pbsSlug: "county-fair", pbsTitle: "Count-y Fair", categoryId: "math-games" },
  { pbsSlug: "signs-seek", pbsTitle: "Signs & Seek", categoryId: "math-games" },
  { pbsSlug: "hero-maker", pbsTitle: "Hero Maker", categoryId: "sports-games" },
];

/** Home page uses different PBS titles for some alias slugs. */
const homeTitleAlts = [
  { pbsSlug: "hamster-water", pbsTitle: "Team Hamster! Splash Dash", sourceSlug: "weather-reporter" },
  { pbsSlug: "froyo-stand", pbsTitle: "Donkey's FroYo Stand", sourceSlug: "build-a-boat" },
  { pbsSlug: "weather-explorer", pbsTitle: "Weather Explorer", sourceSlug: "seek-the-peak" },
  { pbsSlug: "baby-animals", pbsTitle: "Wild Kratts Baby Animal Rescue", sourceSlug: "reboot-rescue" },
  { pbsSlug: "lyla-stu-stunts", pbsTitle: "Stu's Super Stunts", sourceSlug: "lyla-in-the-loop-a-stu-of-your-own" },
  { pbsSlug: "archerfish-bug-rush", pbsTitle: "Archerfish Bug Rush", sourceSlug: "archer-fish-guid" },
];

function buildSlot(entry) {
  const game = assignGame();
  return {
    pbsSlug: entry.pbsSlug,
    pbsTitle: entry.pbsTitle,
    title: game.title,
    category: game.category,
    sonkeId: game.id,
  };
}

const overrides = gamesPageSlots.map(buildSlot);

const slugToSlot = new Map(overrides.map((o) => [o.pbsSlug, o]));

for (const alt of homeTitleAlts) {
  const source = slugToSlot.get(alt.sourceSlug);
  if (!source) continue;
  overrides.push({
    pbsSlug: alt.pbsSlug,
    pbsTitle: alt.pbsTitle,
    pbsTitleAlt: alt.pbsTitle,
    title: source.title,
    category: source.category,
    sonkeId: source.sonkeId,
  });
}

writeFileSync(
  join(root, "content", "games.json"),
  `${JSON.stringify(
    {
      sectionHeadings: [
        { pbsHeading: "Summer Games", title: "Puzzle Games" },
        { pbsHeading: "New Games", title: "Arcade Games" },
        { pbsHeading: "Summer Is Here!", title: "Strategy & Board" },
        { pbsHeading: "New and Popular!", title: "Math & Learn" },
        { pbsHeading: "Quizzes", title: "Sports & Skill" },
        { pbsHeading: "Video Discover This Week", title: "Featured" },
      ],
      overrides,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const slugMappings = [];
const seenPbsSlugs = new Set();

for (const slot of overrides) {
  if (!slot.pbsSlug || seenPbsSlugs.has(slot.pbsSlug)) continue;
  seenPbsSlugs.add(slot.pbsSlug);
  slugMappings.push({
    pbsSlug: slot.pbsSlug,
    sonkeId: slot.sonkeId ?? slugify(slot.title),
    title: slot.title,
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
