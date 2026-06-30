import { readFileSync } from "fs";

const html = readFileSync("public/pbs-games.html", "utf8");
const match = html.match(
  /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
);
const data = JSON.parse(match[1]);

const properties = [];

function walk(node) {
  if (!node || typeof node !== "object") return;
  if (node.__typename === "PropertiesNavBannerCard" && node.property?.[0]?.title) {
    properties.push({
      title: node.property[0].title,
      slug: node.property[0].slug,
    });
  }
  if (Array.isArray(node)) node.forEach(walk);
  else Object.values(node).forEach(walk);
}

walk(data);
console.log(`Property nav slots: ${properties.length}`);
properties.forEach((p, i) => console.log(`${i + 1}. ${p.title} (${p.slug})`));
