import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "..", "tmp-logiclike.html"), "utf8");
const pages = html.split("<!DOCTYPE").filter(Boolean).map((p) => `<!DOCTYPE${p}`);

for (let i = 0; i < pages.length; i++) {
  const page = pages[i];
  const route = page.match(/game\.\$gameName|exercise\.\$targetLesson|dashboard\/_la/);
  console.log(`\npage ${i + 1} route hint:`, route?.[0] ?? "unknown");

  const paths = [
    ...page.matchAll(/en\\\/v3\\\/cabinet\\\/exercise\\\/[^"\\]+/g),
    ...page.matchAll(/exercise\\\/logic\\\/\d+\\\/\d+\\\/\d+/g),
    ...page.matchAll(/problem\\\/\d+/g),
    ...page.matchAll(/"targetLesson","([^"]+)"/g),
    ...page.matchAll(/targetLesson\\",\\"([^"\\]+)/g),
  ];
  const uniq = [...new Set(paths.map((m) => m[0].replace(/\\/g, "")))];
  for (const u of uniq.slice(0, 20)) console.log(" ", u);
}

// also search unescaped
const all = html.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
const exerciseUrls = [...all.matchAll(/\/en\/v3\/cabinet\/exercise\/[a-zA-Z0-9_./-]+/g)].map((m) => m[0]);
console.log("\nunescaped exercise urls:", [...new Set(exerciseUrls)].slice(0, 20));
