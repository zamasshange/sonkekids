/**
 * Maps PBS property carousel to Sonke game categories.
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
  { slug: "pbs-kids-2", pbsTitle: "Sonke Kids", pbsTitleAlt: "All Games" },
  ...catalog.categories.map((category) => ({
    slug: category.id,
    pbsTitle: category.title,
  })),
];

const propertyMap = {};
for (const slot of PROPERTY_SLOTS) {
  const category =
    slot.slug === "pbs-kids-2"
      ? { id: "all-games", title: "All Games" }
      : catalog.categories.find((c) => c.id === slot.slug) ?? catalog.categories[0];

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
