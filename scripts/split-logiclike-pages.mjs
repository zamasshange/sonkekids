import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "..", "tmp-logiclike.html"), "utf8");
const pages = html.split("<!DOCTYPE").filter(Boolean).map((p, i) => `<!DOCTYPE${p}`);

console.log("pages", pages.length);

for (let i = 0; i < pages.length; i++) {
  const page = pages[i];
  const routeMatch = page.match(/__reactRouterRouteModules\s*=\s*(\{[^}]+\})/);
  const routes = routeMatch ? routeMatch[1] : "unknown";
  const staticGames = [...page.matchAll(/\/static\/games\/[^"'\s<>]+/g)].map((m) => m[0]);
  const exerciseRoute = page.match(/exercise\.[^"']+/);
  const iframe = page.match(/<iframe[^>]+src="([^"]+)"/);
  const title = page.match(/<title>([^<]+)<\/title>/);
  console.log(`\n--- page ${i + 1} ---`);
  console.log("title:", title?.[1]);
  console.log("routes:", routes.slice(0, 200));
  if (exerciseRoute) console.log("exercise route:", exerciseRoute[0]);
  if (iframe) console.log("iframe:", iframe[1]);
  if (staticGames.length) console.log("static:", [...new Set(staticGames)]);
}
