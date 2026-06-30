import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const t = readFileSync(join(__dirname, "..", "tmp-ll-game-page.js"), "utf8");
console.log("len", t.length);
for (const needle of ["countInOrder", "static/games", "rive", "onlyInApp", "iframe", "trace:"]) {
  const idx = t.indexOf(needle);
  if (idx >= 0) console.log(`\n--- ${needle} @ ${idx} ---\n`, t.slice(Math.max(0, idx - 80), idx + 200));
}
