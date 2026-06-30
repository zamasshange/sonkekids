import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const transcript = join(
  process.env.USERPROFILE ?? "",
  ".cursor/projects/c-Users-Lenovo-Downloads-sonke-games/agent-transcripts/07e8cfef-1cec-4c31-b585-1ba93815b701/07e8cfef-1cec-4c31-b585-1ba93815b701.jsonl",
);
const line = readFileSync(transcript, "utf8").split("\n")[722];
const text = JSON.parse(line).message.content.find((c) => c.type === "text").text;
const htmlIdx = text.indexOf("<!DOCTYPE");
const html = text.slice(htmlIdx);
writeFileSync(join(__dirname, "..", "tmp-logiclike.html"), html);
console.log("html length:", html.length);

const urlRe = /https?:\/\/[^"'\\s<>]+/gi;
const urls = [...new Set(html.match(urlRe) ?? [])];
const logiclikeUrls = urls.filter((u) => u.includes("logiclike"));
console.log("\nLogicLike URLs:", logiclikeUrls.length);
for (const u of logiclikeUrls.slice(0, 80)) console.log(u);

const jsonChunks = [];
for (const m of html.matchAll(/<script[^>]*>(\{[\s\S]*?\})<\/script>/g)) {
  if (m[1].includes("game") || m[1].includes("exercise") || m[1].includes("slug")) {
    jsonChunks.push(m[1].slice(0, 500));
  }
}
console.log("\nJSON script chunks:", jsonChunks.length);
for (const c of jsonChunks.slice(0, 5)) console.log(c.slice(0, 300), "\n---");

const gameLike = [...html.matchAll(/"(?:title|name|slug|gameId|exerciseId|topic)"\s*:\s*"([^"]+)"/g)]
  .map((m) => `${m[0]}`)
  .slice(0, 100);
console.log("\nGame-like fields:", gameLike.length);
for (const g of [...new Set(gameLike)].slice(0, 60)) console.log(g);
