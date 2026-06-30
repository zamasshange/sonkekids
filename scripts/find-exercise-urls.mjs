import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "..", "tmp-logiclike.html"), "utf8");
const pages = html.split("<!DOCTYPE").filter(Boolean).map((p) => `<!DOCTYPE${p}`);

for (let i = 0; i < pages.length; i++) {
  const page = pages[i];
  const chunks = [...page.matchAll(/streamController\.enqueue\("((?:\\.|[^"\\])*)"\)/gs)];
  if (!chunks.length) continue;
  const full = chunks.map((m) => JSON.parse(`"${m[1]}"`)).join("");
  // look for exercise URL segments
  const matches = [
    ...full.matchAll(/logic\/\d+\/\d+\/\d+/g),
    ...full.matchAll(/problem\/\d+/g),
    ...full.matchAll(/"id":\d{4,8}/g),
    ...full.matchAll(/targetLesson[^,]{0,30}/gi),
  ];
  console.log(`\npage ${i + 1} chunk len ${full.length}`);
  const uniq = [...new Set(matches.map((m) => m[0]))];
  for (const u of uniq.slice(0, 30)) console.log(" ", u);
}
