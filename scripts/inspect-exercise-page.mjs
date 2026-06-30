import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const t = readFileSync(join(__dirname, "..", "tmp-exercise-page.js"), "utf8");
console.log("len", t.length);
const apis = [...t.matchAll(/["'](\/api\/[^"']+)["']/g)].map((m) => m[1]);
console.log("apis", [...new Set(apis)].slice(0, 40));
const urls = [...t.matchAll(/["'](\/en\/v3\/[^"']+)["']/g)].map((m) => m[1]);
console.log("urls", [...new Set(urls)].slice(0, 20));
const rive = [...t.matchAll(/rive[^"']{0,30}["']([^"']+)["']/gi)].map((m) => m[0].slice(0, 100));
console.log("rive", rive.slice(0, 10));
