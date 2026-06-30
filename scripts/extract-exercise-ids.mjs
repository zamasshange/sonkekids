import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "..", "tmp-logiclike.html"), "utf8");
const pages = html.split("<!DOCTYPE").filter(Boolean).map((p) => `<!DOCTYPE${p}`);

for (const [i, page] of pages.entries()) {
  const chunks = [...page.matchAll(/streamController\.enqueue\("((?:\\.|[^"\\])*)"\)/g)].map((m) =>
    JSON.parse(`"${m[1]}"`),
  );
  console.log(`\npage ${i + 1} chunks:`, chunks.length);

  const blob = chunks.join(" ");
  const nums = [...blob.matchAll(/"problemId"|problemId|targetLesson|blockNumber|complexity/gi)];
  console.log("keywords:", nums.length);

  // find numeric ids near problem
  const idMatches = [...blob.matchAll(/problem[^\\]{0,40}?(\d{3,8})/gi)].slice(0, 10);
  for (const m of idMatches) console.log(" id near problem:", m[0].slice(0, 80));

  // canonical URL patterns in stream
  const paths = [...blob.matchAll(/logic\/\d+\/\d+\/\d+\/problem\/\d+/g)];
  for (const p of [...new Set(paths.map((m) => m[0]))].slice(0, 10)) console.log(" path:", p);

  const enPaths = [...blob.matchAll(/en\/v3\/cabinet\/exercise\/[^\\"]+/g)];
  for (const p of [...new Set(enPaths.map((m) => m[0]))].slice(0, 10)) console.log(" en:", p);
}
