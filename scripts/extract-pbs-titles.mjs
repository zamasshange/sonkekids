import { readFileSync, writeFileSync } from "fs";

function extractNextData(html) {
  const match = html.match(
    /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
  );
  return match ? JSON.parse(match[1]) : null;
}

function collectTitles(node, out = new Set()) {
  if (!node || typeof node !== "object") return out;
  if (typeof node.title === "string" && node.title.length < 80 && !node.title.startsWith("PBSK")) {
    out.add(node.title);
  }
  if (Array.isArray(node)) node.forEach((item) => collectTitles(item, out));
  else Object.values(node).forEach((item) => collectTitles(item, out));
  return out;
}

for (const file of ["pbs-games.html", "pbs-home.html", "pbs-videos.html"]) {
  const html = readFileSync(`public/${file}`, "utf8");
  const data = extractNextData(html);
  const titles = [...collectTitles(data)].sort();
  writeFileSync(`scripts/pbs-titles-${file.replace(".html", "")}.txt`, titles.join("\n"), "utf8");
  console.log(`\n=== ${file} (${titles.length} titles) ===`);
  console.log(titles.filter((t) => !t.includes("Theme")).join("\n"));
}
