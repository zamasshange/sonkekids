import { readFileSync } from "fs";

function extractGames(data, file) {
  const items = [];
  let section = "";

  function walk(node) {
    if (!node || typeof node !== "object") return;

    if (
      typeof node.heading === "string" &&
      node.heading.length > 0 &&
      node.heading.length < 60 &&
      !node.heading.includes("Theme")
    ) {
      section = node.heading;
    }

    if (node.__typename === "Game" && node.title) {
      items.push({
        file,
        section,
        title: node.title,
        slug: node.slug ?? node.gameSlug ?? "",
        id: node.id ?? "",
      });
    }

    if (Array.isArray(node)) node.forEach(walk);
    else Object.values(node).forEach(walk);
  }

  walk(data);
  return items;
}

for (const file of ["games.json", "index.json"]) {
  const data = JSON.parse(readFileSync(`public/pbs/data/${file}`, "utf8"));
  const items = extractGames(data, file);
  console.log(`\n=== ${file}: ${items.length} game slots ===`);
  const sections = [...new Set(items.map((item) => item.section))];
  console.log("Sections:", sections.join(" | "));
  for (const item of items) {
    console.log(`  [${item.section || "?"}] ${item.title}`);
  }
}
