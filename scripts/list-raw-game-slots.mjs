import { readFileSync } from "fs";

function extractNextData(html) {
  const match = html.match(
    /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
  );
  return match ? JSON.parse(match[1]) : null;
}

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
      });
    }

    if (Array.isArray(node)) node.forEach(walk);
    else Object.values(node).forEach(walk);
  }

  walk(data);
  return items;
}

for (const [source, label] of [
  ["pbs-games.html", "games"],
  ["pbs-home.html", "home"],
]) {
  const html = readFileSync(`public/${source}`, "utf8");
  const data = extractNextData(html);
  const items = extractGames(data, label);
  console.log(`\n=== ${label}: ${items.length} slots ===`);
  for (const item of items) {
    console.log(`  [${item.section}] ${item.title} (${item.slug})`);
  }
}
