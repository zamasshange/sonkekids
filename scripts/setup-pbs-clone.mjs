import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const pbsDir = join(publicDir, "pbs");

const pages = [
  { source: "pbs-home.html", dest: "index.html" },
  { source: "pbs-games.html", dest: "games.html" },
  { source: "pbs-videos.html", dest: "videos.html" },
];

const PBS_ORIGIN = "https://pbskids.org";
const BRAND_KIDS = "Sonke Kids";
const BRAND_GAMES = "Sonke Games";

const SONKE_KIDS_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="101" height="101" fill="none" viewBox="0 0 101 101" role="img"><title>${BRAND_KIDS}</title><path d="M50 .8C22.385.8 0 23.186 0 50.8s22.385 50 50 50 50-22.385 50-50S77.61.8 50 .8" style="fill:#2638c4"></path><g class="letters-group letters-sonke"><text x="50.5" y="40" text-anchor="middle" fill="#99cf16" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="12.5">SONKE</text></g><g class="letters-group letters-kids"><text x="50.5" y="72" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="17">KIDS</text></g></svg>`;

const LOGO_SVG_PATTERN =
  /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="101" height="101" fill="none" viewBox="0 0 101 101" role="img">[\s\S]*?<\/svg>/g;

function applyTextReplacements(html, dest) {
  let branded = html;

  if (dest === "games.html") {
    branded = branded.replaceAll("Games | PBS KIDS", BRAND_GAMES);
    branded = branded.replaceAll(
      "Play games with your PBS KIDS favorites",
      "Play games with your Sonke Kids favorites",
    );
  } else if (dest === "videos.html") {
    branded = branded.replaceAll("Videos | PBS KIDS", `Videos | ${BRAND_KIDS}`);
    branded = branded.replaceAll(
      "Watch for free your favorite PBS KIDS shows",
      "Watch for free your favorite Sonke Kids shows",
    );
  }

  const replacements = [
    ["PBS Kids Shows", "Sonke Kids Shows"],
    ["PBS KIDS Shows", "Sonke Kids Shows"],
    ["PBS KIDS Read", "Sonke Kids Read"],
    ["PBS KIDS shows", "Sonke Kids shows"],
    ["PBS KIDS favorites", "Sonke Kids favorites"],
    ["PBS Kids", BRAND_KIDS],
    ["PBS KIDS", BRAND_KIDS],
    ["@pbskids", "@sonkekids"],
    [">pbskids.org ©", ">Sonke Kids ©"],
    ['content="https://pbskids.org/games"', 'content="/games"'],
    ['content="https://pbskids.org/videos"', 'content="/videos"'],
    ['content="https://pbskids.org/"', 'content="/"'],
  ];

  for (const [from, to] of replacements) {
    branded = branded.replaceAll(from, to);
  }

  return branded;
}

function replaceHeaderLogo(html) {
  return html.replace(LOGO_SVG_PATTERN, SONKE_KIDS_LOGO_SVG);
}

function injectFavicon(html) {
  const faviconTags =
    '<link rel="icon" href="/sonke-favicon.svg" type="image/svg+xml" data-sonke-favicon="true"/>' +
    '<link rel="apple-touch-icon" href="/sonke-favicon.svg" data-sonke-favicon="true"/>';

  let updated = html
    .replace(/<link rel="apple-touch-icon"[^>]*>/g, "")
    .replace(/<meta[^>]*PBSKidsLogo[^>]*>/g, "")
    .replace(/https:\/\/pbskids\.orghttps:\/\/pbskids\.org/g, "https://pbskids.org");

  if (!updated.includes("data-sonke-favicon")) {
    updated = updated.replace("<head>", `<head>${faviconTags}`);
  }

  return updated;
}

function stripHeavyClientAssets(html) {
  return (
    html
      // Drop PBS React bundles — SSR HTML already renders the page; hydration caused CPU loops.
      .replace(/<script\b[^>]*\bsrc="\/_next\/static\/chunks\/[^"]+"[^>]*>\s*<\/script>/g, "")
      .replace(/<script\b[^>]*\bsrc="\/_next\/static\/[^"]+\/_buildManifest\.js"[^>]*>\s*<\/script>/g, "")
      .replace(/<script\b[^>]*\bsrc="\/_next\/static\/[^"]+\/_ssgManifest\.js"[^>]*>\s*<\/script>/g, "")
      .replace(/<script id="__NEXT_DATA__"[\s\S]*?<\/script>/g, "")
      .replace(/<link rel="preconnect" href="\/\/www\.googletagmanager\.com"[^>]*>/g, "")
      .replace(/<noscript><iframe src="\/\/www\.googletagmanager\.com[^"]*"[\s\S]*?<\/iframe><\/noscript>/g, "")
  );
}

function updateWebManifest(html) {
  return html.replace(
    /href="data:application\/manifest\+json;base64,([^"]+)"/,
    (match, encoded) => {
      try {
        const manifest = JSON.parse(
          Buffer.from(encoded, "base64").toString("utf8"),
        );
        manifest.name = `${BRAND_KIDS} Website`;
        manifest.short_name = BRAND_KIDS;
        if (manifest.start_url) manifest.start_url = "/";
        if (manifest.id) manifest.id = "/";
        const updated = Buffer.from(JSON.stringify(manifest)).toString("base64");
        return `href="data:application/manifest+json;base64,${updated}"`;
      } catch {
        return match;
      }
    },
  );
}

function applyBranding(html, dest) {
  let branded = applyTextReplacements(html, dest);
  branded = replaceHeaderLogo(branded);
  branded = injectFavicon(branded);
  branded = stripHeavyClientAssets(branded);
  return updateWebManifest(branded);
}

function decodeNextImageUrl(encodedUrl) {
  const decoded = decodeURIComponent(encodedUrl);
  if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
    return decoded;
  }
  if (decoded.startsWith("/")) {
    return `${PBS_ORIGIN}${decoded}`;
  }
  return `${PBS_ORIGIN}/${decoded}`;
}

function processHtml(html, dest) {
  return applyBranding(
    html
      .replace(/\/_next\/image\?url=([^&"'\s]+)(?:&(?:amp;)?[^"'\s]*)?/g, (_, encodedUrl) =>
        decodeNextImageUrl(encodedUrl),
      )
      .replace(
        /const loadSW[\s\S]*?loadSW\([\s\S]*?\);[\s\S]*?<\/script>/,
        "",
      )
      .replace(/href="https:\/\/pbskids\.org\/"/g, 'href="/"')
      .replace(/href="https:\/\/pbskids\.org\/games"/g, 'href="/games"')
      .replace(/href="https:\/\/pbskids\.org\/videos"/g, 'href="/videos"'),
    dest,
  );
}

mkdirSync(pbsDir, { recursive: true });

for (const { source, dest } of pages) {
  const sourcePath = join(publicDir, source);
  const raw = readFileSync(sourcePath, "utf8");
  const processed = processHtml(raw, dest);
  writeFileSync(join(pbsDir, dest), processed, "utf8");
  console.log(`Wrote public/pbs/${dest}`);
}

console.log("Sonke Kids pages ready.");
