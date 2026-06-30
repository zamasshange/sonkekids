import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "..", "tmp-logiclike.html"), "utf8");
const pages = html.split("<!DOCTYPE").filter(Boolean).map((p) => `<!DOCTYPE${p}`);

function pageChunks(page) {
  return [...page.matchAll(/streamController\.enqueue\("((?:\\.|[^"\\])*)"\)/gs)].map((m) =>
    JSON.parse(`"${m[1]}"`),
  );
}

for (let i = 0; i < pages.length; i++) {
  const chunks = pageChunks(pages[i]);
  console.log(`page ${i + 1}: ${chunks.length} chunks, lengths: ${chunks.map((c) => c.length).join(", ")}`);
}

// diff page1 vs page2
const p1 = pageChunks(pages[0])[0];
const p2 = pageChunks(pages[1])[0];
if (p1 && p2) {
  let diff = 0;
  for (let i = 0; i < Math.min(p1.length, p2.length); i++) {
    if (p1[i] !== p2[i]) {
      console.log("\nfirst diff at", i);
      console.log("p1:", p1.slice(Math.max(0, i - 40), i + 120));
      console.log("p2:", p2.slice(Math.max(0, i - 40), i + 120));
      diff++;
      if (diff > 3) break;
    }
  }
}
