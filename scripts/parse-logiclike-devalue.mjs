import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "..", "tmp-logiclike.html"), "utf8");

const chunks = [...html.matchAll(/streamController\.enqueue\("((?:\\.|[^"\\])*)"\)/g)].map((m) =>
  JSON.parse(`"${m[1]}"`),
);

function decodeDevalue(input) {
  const parsed = JSON.parse(input);
  const refs = new Map();

  function resolve(v) {
    if (v == null || typeof v !== "object") return v;
    if (Array.isArray(v)) {
      if (v.length === 2 && typeof v[0] === "string" && v[0].startsWith("_")) {
        const key = v.join(":");
        if (refs.has(key)) return refs.get(key);
        const out = resolve(v[1]);
        refs.set(key, out);
        return out;
      }
      return v.map(resolve);
    }
    const out = {};
    for (const [k, val] of Object.entries(v)) out[k] = resolve(val);
    return out;
  }

  return resolve(parsed);
}

const decoded = chunks.map((c, i) => {
  try {
    return decodeDevalue(c);
  } catch (e) {
    console.warn("chunk", i, e.message);
    return null;
  }
});

function collectObjects(root, pred, out = []) {
  if (!root || typeof root !== "object") return out;
  if (pred(root)) out.push(root);
  if (Array.isArray(root)) root.forEach((x) => collectObjects(x, pred, out));
  else Object.values(root).forEach((x) => collectObjects(x, pred, out));
  return out;
}

const games = [];
const exercises = [];
const problems = [];

for (const d of decoded.filter(Boolean)) {
  collectObjects(d, (o) => o && typeof o === "object" && "slug" in o && "title" in o, games);
  collectObjects(d, (o) => o && typeof o === "object" && ("problemId" in o || "problem" in o), problems);
  collectObjects(d, (o) => o && typeof o === "object" && ("blockNumber" in o || "targetLesson" in o), exercises);
}

console.log("decoded chunks", decoded.filter(Boolean).length);
console.log("game-like", games.length);
console.log("problem-like", problems.length);
console.log("exercise-like", exercises.length);

const uniqueGames = new Map();
for (const g of games) {
  const key = `${g.id ?? ""}:${g.slug ?? g.title}`;
  if (!uniqueGames.has(key)) uniqueGames.set(key, g);
}

console.log("\nUnique games:");
for (const g of uniqueGames.values()) {
  console.log(JSON.stringify({
    id: g.id,
    title: g.title,
    slug: g.slug,
    topic: g.topic ?? g.topicName ?? g.category,
    image: g.image ?? g.previewImage ?? g.thumbnail ?? g.cover,
    url: g.url ?? g.link,
    type: g.type,
  }));
}

writeFileSync(join(__dirname, "..", "tmp-logiclike-decoded.json"), JSON.stringify(decoded, null, 2));
