import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
for (const file of ["tmp-exercises-api.js", "tmp-exercise-page.js"]) {
  const t = readFileSync(join(__dirname, "..", file), "utf8");
  console.log(`\n=== ${file} (${t.length}) ===`);
  const paths = [...t.matchAll(/["'](\/[^"']{3,80})["']/g)].map((m) => m[1]);
  const api = [...new Set(paths)].filter((p) => p.includes("api") || p.includes("service") || p.includes("exercise") || p.includes("problem"));
  console.log(api.slice(0, 40));
}
