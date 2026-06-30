import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "..", "tmp-logiclike.html"), "utf8");

const chunks = [...html.matchAll(/streamController\.enqueue\("((?:\\.|[^"\\])*)"\)/g)].map((m) =>
  JSON.parse(`"${m[1]}"`),
);

function decodeDevalue(serialized) {
  const input = JSON.parse(serialized);
  const resolved = new Map();

  function revive(value) {
    if (value === null || typeof value !== "object") return value;

    if (Array.isArray(value)) {
      if (
        value.length === 2 &&
        typeof value[0] === "string" &&
        /^_\d+$/.test(value[0])
      ) {
        const refKey = value[0];
        if (resolved.has(refKey)) return resolved.get(refKey);
        const placeholder = {};
        resolved.set(refKey, placeholder);
        const actual = revive(value[1]);
        if (typeof actual === "object" && actual !== null) {
          Object.assign(placeholder, actual);
          return placeholder;
        }
        resolved.set(refKey, actual);
        return actual;
      }
      return value.map(revive);
    }

    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = revive(v);
    return out;
  }

  return revive(input);
}

const all = [];
for (const chunk of chunks) {
  try {
    all.push(decodeDevalue(chunk));
  } catch (e) {
    console.warn("fail", e.message);
  }
}

function walk(node, fn) {
  if (node == null) return;
  fn(node);
  if (Array.isArray(node)) node.forEach((x) => walk(x, fn));
  else if (typeof node === "object") Object.values(node).forEach((x) => walk(x, fn));
}

const hits = [];
walk(all, (node) => {
  if (typeof node !== "object" || node === null || Array.isArray(node)) return;
  const keys = Object.keys(node);
  if (
    keys.some((k) =>
      /problem|exercise|game|lesson|block|thumbnail|image|embed|topic|title|slug|url/i.test(k),
    )
  ) {
    hits.push(node);
  }
});

console.log("hits", hits.length);

const interesting = hits.filter((h) => {
  const s = JSON.stringify(h);
  return (
    /problem|exercise|game|lesson|block/i.test(s) &&
    (h.title || h.name || h.slug || h.problemId || h.id || h.url || h.embedUrl)
  );
});

console.log("interesting", interesting.length);
for (const h of interesting.slice(0, 40)) {
  console.log(JSON.stringify(h).slice(0, 500));
}

// search strings for exercise paths
const strings = [];
walk(all, (node) => {
  if (typeof node === "string") strings.push(node);
});
const exercisePaths = strings.filter((s) => s.includes("exercise") || s.includes("/game/"));
console.log("\nexercise paths", exercisePaths.length);
for (const s of [...new Set(exercisePaths)].slice(0, 30)) console.log(s);

writeFileSync(join(__dirname, "..", "tmp-logiclike-hits.json"), JSON.stringify(interesting, null, 2));
