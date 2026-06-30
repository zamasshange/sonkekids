/**
 * Fetch and cache high-traffic PBS pages (show hubs, video hubs, game topics).
 */
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { processPlayHtml } from "./lib/pbs-play-process.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pagesDir = join(root, "public", "pbs", "pages");

const PBS_ORIGIN = "https://pbskids.org";
const DELAY_MS = 350;

const SHOW_PAGES = [
  "/daniel",
  "/phoebeandjay",
  "/sesame",
  "/weatherhunters",
  "/carl",
  "/wildkratts",
  "/lyla",
  "/countonjunebug",
  "/rosiesrules",
  "/wombats",
  "/almasway",
  "/donkeyhodie",
  "/oddsquad",
  "/cityisland",
  "/arthur",
  "/pinkalicious",
  "/clifford",
  "/elinor",
  "/acousticrooster",
  "/jellybenandpogo",
  "/molly",
  "/xavier",
  "/naturecat",
  "/dinosaurtrain",
  "/scribblesandink",
  "/luna",
  "/heroelementary",
  "/cyberchase",
  "/ruff",
  "/humblemediagenius",
  "/curiousgeorge",
  "/catinthehat",
  "/peg",
  "/readyjetgo",
  "/superwhy",
  "/sid",
];

const VIDEO_HUB_PAGES = [
  "/videos/weatherhunters",
  "/videos/daniel",
  "/videos/wildkratts",
  "/videos/sesame",
  "/videos/molly",
  "/videos/elinor",
  "/videos/pinkalicious",
  "/videos/arthur",
  "/videos/superwhy",
  "/videos/curiousgeorge",
  "/videos/dinosaurtrain",
  "/videos/naturecat",
  "/videos/oddsquad",
  "/videos/catinthehat",
  "/videos/peg",
  "/videos/sid",
  "/videos/cyberchase",
  "/videos/readyjetgo",
  "/videos/clifford",
  "/videos/heroelementary",
];

const EXTRA_PATHS = ["/pbskidsread"];

function pathToFile(pathname) {
  const normalized = pathname.replace(/^\/+|\/+$/g, "") || "index";
  return normalized.replace(/\//g, "__") + ".html";
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(pathname) {
  const url = `${PBS_ORIGIN}${pathname}`;
  const response = await fetch(url, {
    headers: {
      accept: "text/html",
      referer: `${PBS_ORIGIN}/`,
      "user-agent": "SonkeKidsSetup/1.0",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function main() {
  mkdirSync(pagesDir, { recursive: true });

  const paths = [...new Set([...SHOW_PAGES, ...VIDEO_HUB_PAGES, ...EXTRA_PATHS])];
  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (const pathname of paths) {
    const outFile = join(pagesDir, pathToFile(pathname));
    if (existsSync(outFile)) {
      skipped += 1;
      continue;
    }

    process.stdout.write(`  ${pathname} ... `);
    try {
      const raw = await fetchPage(pathname);
      const html = processPlayHtml(raw, { pageTitle: "Sonke Kids" });
      writeFileSync(outFile, html, "utf8");
      fetched += 1;
      console.log("ok");
    } catch (error) {
      failed += 1;
      console.log(`fail (${error.message})`);
    }
    await sleep(DELAY_MS);
  }

  console.log(`PBS pages: ${fetched} fetched, ${skipped} cached, ${failed} failed.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
