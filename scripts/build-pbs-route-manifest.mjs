/**
 * Builds content/pbs-route-manifest.json for middleware routing decisions.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const catalog = JSON.parse(
  readFileSync(join(root, "content", "sonke-games-catalog.json"), "utf8"),
);
const slugMap = JSON.parse(
  readFileSync(join(root, "content", "games-slug-map.json"), "utf8"),
);

const catalogGameSlugs = catalog.games.map((g) => g.id);
const pbsGameSlugs = [
  ...new Set(
    slugMap
      .filter((item) => item.pbsSlug !== item.sonkeId)
      .map((item) => item.pbsSlug),
  ),
];

const pbsPages = [];
const pagesDir = join(root, "public", "pbs", "pages");
if (existsSync(pagesDir)) {
  for (const file of readdirSync(pagesDir)) {
    if (!file.endsWith(".html")) continue;
    const pathKey = "/" + file.replace(/\.html$/, "").replace(/__/g, "/");
    pbsPages.push(pathKey);
  }
}

// Extract linked paths from PBS HTML shells
const linkedPaths = new Set();
for (const file of ["public/pbs/index.html", "public/pbs/games.html", "public/pbs/videos.html"]) {
  const full = join(root, file);
  if (!existsSync(full)) continue;
  const html = readFileSync(full, "utf8");
  const hrefs = html.match(/href="(\/[^"#?][^"]*)"/g) ?? [];
  for (const raw of hrefs) {
    const path = raw.slice(6, -1);
    if (path.startsWith("/_next") || path.startsWith("/pbs-")) continue;
    if (path.includes(".")) continue;
    linkedPaths.add(path);
  }
}

// Extract from PBS data JSON
for (const dataFile of ["public/pbs/data/games.json", "public/pbs/data/videos.json", "public/pbs/data/index.json"]) {
  const full = join(root, dataFile);
  if (!existsSync(full)) continue;
  JSON.stringify(JSON.parse(readFileSync(full, "utf8")), (_, value) => {
    if (typeof value === "string" && value.startsWith("/") && !value.includes("[[") && !value.includes(".")) {
      linkedPaths.add(value);
    }
    return value;
  });
}

const manifest = {
  catalogGameSlugs,
  pbsGameSlugs,
  pbsPages: [...new Set([...pbsPages, ...linkedPaths])].sort(),
  playSlugs: existsSync(join(root, "public", "pbs", "play", "index.json"))
    ? JSON.parse(readFileSync(join(root, "public", "pbs", "play", "index.json"), "utf8")).map(
        (e) => e.pbsSlug,
      )
    : [],
};

writeFileSync(
  join(root, "content", "pbs-route-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(
  `Route manifest: ${manifest.catalogGameSlugs.length} games, ${manifest.pbsGameSlugs.length} PBS slugs, ${manifest.pbsPages.length} PBS page paths, ${manifest.playSlugs.length} play pages.`,
);
