import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "..", "tmp-logiclike.html"), "utf8");

// Pull strings from devalue stream chunks
const chunks = [...html.matchAll(/streamController\.enqueue\("((?:\\.|[^"\\])*)"\)/gs)].map((m) =>
  JSON.parse(`"${m[1]}"`),
);

const strings = [];
for (const chunk of chunks) {
  const re = /"((?:\\.|[^"\\])*)"/g;
  let m;
  while ((m = re.exec(chunk))) {
    try {
      strings.push(JSON.parse(`"${m[1]}"`));
    } catch {
      // skip
    }
  }
}

const uniq = [...new Set(strings)];
const numeric = uniq.filter((s) => /^\d{1,6}$/.test(s));
console.log("numeric strings", numeric.length, numeric.slice(0, 50));

const lessonish = uniq.filter((s) =>
  ["logic", "speech", "math", "memory", "focus"].some((k) => s.toLowerCase().includes(k)),
);
console.log("\nlesson-ish:", lessonish.slice(0, 40));

const pathish = uniq.filter((s) => /\/(logic|speech|math|problem)/i.test(s));
console.log("\npath-ish:", pathish.slice(0, 40));

// look for tuples like logic near numbers in raw chunk
for (const chunk of chunks.slice(0, 2)) {
  const idx = chunk.indexOf("logic");
  while (idx >= 0) {
    console.log("\nlogic context:", chunk.slice(idx, idx + 80));
    const next = chunk.indexOf("logic", idx + 1);
    if (next < 0 || next - idx > 5000) break;
  }
}
