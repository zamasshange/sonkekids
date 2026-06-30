/**
 * Maps PBS property carousel slots to Sonke game categories.
 * Run: node scripts/build-property-map.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const catalog = JSON.parse(
  readFileSync(join(root, "content", "sonke-games-catalog.json"), "utf8"),
);

const PROPERTY_SLOTS = [
  { slug: "pbs-kids-2", pbsTitle: "PBS KIDS", pbsTitleAlt: "Sonke Kids" },
  { slug: "daniel", pbsTitle: "Daniel Tiger's Neighborhood" },
  { slug: "phoebe-jay", pbsTitle: "Phoebe & Jay" },
  { slug: "sesame-street", pbsTitle: "Sesame Street" },
  { slug: "weather-hunters", pbsTitle: "Weather Hunters" },
  { slug: "carl-the-collector", pbsTitle: "Carl the Collector" },
  { slug: "wild-kratts", pbsTitle: "Wild Kratts" },
  { slug: "lyla-in-the-loop", pbsTitle: "Lyla in the Loop" },
  { slug: "countonjunebug", pbsTitle: "Count on June Bug!" },
  { slug: "rosies-rules", pbsTitle: "Rosie's Rules" },
  { slug: "work-it-out-wombats", pbsTitle: "Work It Out Wombats!" },
  { slug: "almas-way", pbsTitle: "Alma's Way" },
  { slug: "donkey-hodie", pbsTitle: "Donkey Hodie" },
  { slug: "odd-squad", pbsTitle: "Odd Squad" },
  { slug: "city-island", pbsTitle: "City Island" },
  { slug: "arthur", pbsTitle: "Arthur" },
  { slug: "pinkalicious-and-peterrific", pbsTitle: "Pinkalicious & Peterrific" },
  { slug: "clifford-big-red-dog", pbsTitle: "Clifford the Big Red Dog" },
  { slug: "elinor-wonders-why", pbsTitle: "Elinor Wonders Why" },
  { slug: "acoustic-rooster", pbsTitle: "Acoustic Rooster" },
  { slug: "jelly-ben-pogo", pbsTitle: "Jelly, Ben & Pogo" },
  { slug: "molly-of-denali", pbsTitle: "Molly of Denali" },
  { slug: "xavier-riddle", pbsTitle: "Xavier Riddle and the Secret Museum" },
  { slug: "nature-cat", pbsTitle: "Nature Cat" },
  { slug: "dinosaur-train", pbsTitle: "Dinosaur Train" },
  { slug: "scribbles-and-ink", pbsTitle: "Scribbles and Ink" },
  { slug: "lets-go-luna", pbsTitle: "Let's Go Luna!" },
  { slug: "hero-elementary", pbsTitle: "Hero Elementary" },
  { slug: "cyberchase", pbsTitle: "Cyberchase" },
  { slug: "ruff-ruffman-show", pbsTitle: "Team Hamster! & Ruff Ruffman" },
  {
    slug: "ruff-ruffman-humble-media-genius",
    pbsTitle: "Ruff Ruffman: Humble Media Genius",
  },
  { slug: "curious-george", pbsTitle: "Curious George" },
  { slug: "the-cat-in-the-hat", pbsTitle: "The Cat in the Hat" },
  { slug: "peg-cat", pbsTitle: "Peg + Cat" },
  { slug: "ready-jet-go", pbsTitle: "Ready Jet Go!" },
  { slug: "super-why", pbsTitle: "Super Why!" },
  { slug: "sid-the-science-kid", pbsTitle: "Sid the Science Kid" },
];

const propertyMap = {};

for (let index = 0; index < PROPERTY_SLOTS.length; index += 1) {
  const slot = PROPERTY_SLOTS[index];
  const category =
    index === 0
      ? { id: "all-games", title: "All Games" }
      : catalog.categories[(index - 1) % catalog.categories.length];

  propertyMap[slot.slug] = {
    pbsTitle: slot.pbsTitle,
    ...(slot.pbsTitleAlt ? { pbsTitleAlt: slot.pbsTitleAlt } : {}),
    worldId: category.id,
    worldTitle: category.title,
    guide: null,
  };
}

writeFileSync(
  join(root, "content", "property-map.json"),
  `${JSON.stringify(propertyMap, null, 2)}\n`,
  "utf8",
);

console.log(`Wrote ${Object.keys(propertyMap).length} property/category mappings.`);
