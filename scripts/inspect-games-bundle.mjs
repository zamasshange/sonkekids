import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const t = readFileSync(join(__dirname, "..", "tmp-games.js"), "utf8");
console.log("games bundle length:", t.length);

const patterns = [
  ["title", /title:"([^"]+)"/g],
  ["slug", /slug:"([^"]+)"/g],
  ["id", /id:(\d+)/g],
  ["url", /url:"([^"]+)"/g],
  ["image", /image:"([^"]+)"/g],
  ["thumbnail", /thumbnail:"([^"]+)"/g],
  ["cover", /cover:"([^"]+)"/g],
  ["gameUrl", /gameUrl:"([^"]+)"/g],
  ["embed", /embed[^:]*:"([^"]+)"/gi],
];

for (const [name, re] of patterns) {
  const vals = [...new Set([...t.matchAll(re)].map((m) => m[1]))];
  if (vals.length) {
    console.log(`\n${name} (${vals.length}):`);
    for (const v of vals.slice(0, 30)) console.log(" ", v);
  }
}

// dump a readable slice around "Figures"
for (const needle of ["Figures", "Count in Order", "Digits", "Missing Number", "Uppercase Letters"]) {
  const idx = t.indexOf(needle);
  if (idx >= 0) console.log(`\n--- context for ${needle} ---\n`, t.slice(Math.max(0, idx - 200), idx + 400));
}
