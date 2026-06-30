/**
 * Maps PBS game card slots to Sonke catalog games.
 * Run: node scripts/build-games-overrides.mjs
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

function gamesFromCategory(categoryId, count) {
  const category = catalog.categories.find((item) => item.id === categoryId);
  return category.games.slice(0, count).map((game) => game.title);
}

const puzzleGames = gamesFromCategory("puzzle-games", 10);
const mazeGames = gamesFromCategory("maze-games", 6);
const featuredGames = [
  ...gamesFromCategory("hidden-object-games", 3),
  ...gamesFromCategory("coloring-games", 2),
  ...gamesFromCategory("drawing-games", 1),
  ...gamesFromCategory("music-games", 1),
  ...gamesFromCategory("animal-games", 1),
  ...gamesFromCategory("dinosaur-games", 1),
  ...gamesFromCategory("space-games", 1),
];

const gamesPageSlots = [
  {
    pbsSlug: "weather-reporter",
    pbsTitle: "Weather Reporter",
    title: puzzleGames[0],
    category: "Puzzle Games",
  },
  {
    pbsSlug: "seek-the-peak",
    pbsTitle: "Seek the Peak",
    title: mazeGames[2],
    category: "Maze Games",
  },
  {
    pbsSlug: "build-a-boat",
    pbsTitle: "Build-a-Boat",
    pbsTitleAlt: "Build a Boat",
    title: puzzleGames[2],
    category: "Puzzle Games",
  },
  {
    pbsSlug: "super-duper-halo-halo",
    pbsTitle: "Super Duper Halo-Halo",
    title: puzzleGames[3],
    category: "Puzzle Games",
  },
  {
    pbsSlug: "pinkalicious-beach-game",
    pbsTitle: "Splashtastic Beach Day",
    title: puzzleGames[4],
    category: "Puzzle Games",
  },
  {
    pbsSlug: "elinor-curious-campout",
    pbsTitle: "Elinor Curious Campout",
    title: puzzleGames[5],
    category: "Puzzle Games",
  },
  {
    pbsSlug: "lyla-stu-stunts",
    pbsTitle: "Stu's Super Stunts",
    title: puzzleGames[6],
    category: "Puzzle Games",
  },
  {
    pbsSlug: "scribbles-and-ink-far-and-away",
    pbsTitle: "Scribbles and Ink: Far and Away",
    pbsTitleAlt: "Far and Away",
    title: puzzleGames[7],
    category: "Puzzle Games",
  },
  {
    pbsSlug: "patternpalooza-fair",
    pbsTitle: "Patternpalooza Fair",
    pbsTitleAlt: "Pattern Fair",
    title: puzzleGames[8],
    category: "Puzzle Games",
  },
  {
    pbsSlug: "archerfish-bug-rush",
    pbsTitle: "Archerfish Bug Rush",
    title: puzzleGames[9],
    category: "Puzzle Games",
  },
  {
    pbsSlug: "reboot-rescue",
    pbsTitle: "Reboot Rescue",
    title: mazeGames[0],
    category: "Maze Games",
  },
  {
    pbsSlug: "treeborhood-party-quest",
    pbsTitle: "Treeborhood Party Quest",
    title: mazeGames[1],
    category: "Maze Games",
  },
  {
    pbsSlug: "count-y-fair",
    pbsTitle: "Count-y Fair",
    title: mazeGames[2],
    category: "Maze Games",
  },
  {
    pbsSlug: "phoebe-signs-seek",
    pbsTitle: "Signs & Seek",
    title: mazeGames[3],
    category: "Maze Games",
  },
  {
    pbsSlug: "hero-maker",
    pbsTitle: "Hero Maker",
    title: mazeGames[4],
    category: "Maze Games",
  },
];

const homePageSlots = [
  {
    pbsSlug: "pinkalicious-beach-game",
    pbsTitle: "Splashtastic Beach Day",
    title: featuredGames[0],
    category: "Featured Games",
  },
  {
    pbsSlug: "hamster-water",
    pbsTitle: "Team Hamster! Splash Dash",
    title: featuredGames[1],
    category: "Featured Games",
  },
  {
    pbsSlug: "build-a-boat",
    pbsTitle: "Build-a-Boat",
    pbsTitleAlt: "Build a Boat",
    title: featuredGames[2],
    category: "Featured Games",
  },
  {
    pbsSlug: "froyo-stand",
    pbsTitle: "Donkey's Froyo Stand game; Donkey holds a cup of frozen yogurt.",
    pbsTitleAlt: "Donkey's FroYo Stand",
    title: featuredGames[3],
    category: "Featured Games",
  },
  {
    pbsSlug: "weather-explorer",
    pbsTitle: "Weather Explorer",
    title: featuredGames[4],
    category: "Featured Games",
  },
  {
    pbsSlug: "elinor-curious-campout",
    pbsTitle: "Elinor Curious Campout",
    title: featuredGames[5],
    category: "Featured Games",
  },
  {
    pbsSlug: "seek-the-peak",
    pbsTitle: "Seek the Peak",
    title: featuredGames[6],
    category: "Featured Games",
  },
  {
    pbsSlug: "scribbles-and-ink-far-and-away",
    pbsTitle: "Scribbles and Ink: Far and Away",
    pbsTitleAlt: "Far and Away",
    title: featuredGames[7],
    category: "Featured Games",
  },
  {
    pbsSlug: "patternpalooza-fair",
    pbsTitle: "Patternpalooza Fair",
    pbsTitleAlt: "Pattern Fair",
    title: featuredGames[8],
    category: "Featured Games",
  },
  {
    pbsSlug: "baby-animals",
    pbsTitle: "Baby Animal Rescue",
    pbsTitleAlt: "Wild Kratts Baby Animal Rescue",
    title: featuredGames[9],
    category: "Featured Games",
  },
];

const overrideMap = new Map();
for (const slot of gamesPageSlots) {
  overrideMap.set(slot.pbsTitle, slot);
  if (slot.pbsTitleAlt) {
    overrideMap.set(slot.pbsTitleAlt, slot);
  }
}
for (const slot of homePageSlots) {
  if (!overrideMap.has(slot.pbsTitle)) {
    overrideMap.set(slot.pbsTitle, slot);
  }
  if (slot.pbsTitleAlt && !overrideMap.has(slot.pbsTitleAlt)) {
    overrideMap.set(slot.pbsTitleAlt, slot);
  }
}

const overrides = [...overrideMap.values()];

const gamesJson = {
  sectionHeadings: [
    { pbsHeading: "Summer Games", "title": "Puzzle Games" },
    { pbsHeading: "New Games", "title": "Maze Games" },
    { pbsHeading: "Summer Is Here!", "title": "Featured Games" },
    { pbsHeading: "New and Popular!", "title": "Puzzle Games" },
    { pbsHeading: "Quizzes", "title": "Maze Games" },
  ],
  overrides,
};

writeFileSync(
  join(root, "content", "games.json"),
  `${JSON.stringify(gamesJson, null, 2)}\n`,
  "utf8",
);

const slugMappings = overrides
  .filter((slot) => slot.pbsSlug)
  .map((slot) => ({
    pbsSlug: slot.pbsSlug,
    sonkeId: slugify(slot.title),
    title: slot.title,
  }));

writeFileSync(
  join(root, "content", "games-slug-map.json"),
  `${JSON.stringify(slugMappings, null, 2)}\n`,
  "utf8",
);

console.log(`Wrote ${overrides.length} game slot overrides.`);
console.log(`Wrote ${slugMappings.length} PBS slug mappings.`);
