import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "..", "tmp-logiclike.html"), "utf8");

const chunks = [...html.matchAll(/streamController\.enqueue\("((?:\\.|[^"\\])*)"\)/g)].map((m) =>
  JSON.parse(`"${m[1]}"`),
);

console.log("SSR chunks:", chunks.length);

const allStrings = new Set();
const objects = [];

function walk(v) {
  if (v == null) return;
  if (typeof v === "string") {
    allStrings.add(v);
    return;
  }
  if (typeof v === "object") {
    objects.push(v);
    for (const x of Object.values(v)) walk(x);
  }
}

for (const chunk of chunks) {
  try {
    walk(JSON.parse(chunk));
  } catch {
    // partial chunk
  }
}

const interesting = [...allStrings].filter(
  (s) =>
    /figures|digits|count|letter|missing|speech|logic|math|focus|edutainment|exercise|problem|game|thumbnail|image|topic|title|slug|embed|rive|wasm/i.test(
      s,
    ) || s.includes("logiclike") || s.includes("s3."),
);

console.log("\nInteresting strings:", interesting.length);
for (const s of interesting.sort().slice(0, 120)) console.log(s);

const urlStrings = [...allStrings].filter((s) => s.startsWith("http") || s.startsWith("/en/"));
console.log("\nURL-like strings:", urlStrings.length);
for (const s of urlStrings.slice(0, 80)) console.log(s);

writeFileSync(join(__dirname, "..", "tmp-logiclike-strings.json"), JSON.stringify([...allStrings].sort(), null, 2));
