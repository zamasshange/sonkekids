import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  collectRemoteImageUrls,
  downloadAssets,
  extractNextData,
  localizeImageUrls,
} from "./lib/pbs-assets.mjs";
import { buildLocalAssetsPatch } from "./lib/local-assets-patch.mjs";
import { buildSonkeContentPatch } from "./lib/sonke-content-patch.mjs";
import {
  applySonkeContent,
  loadSonkeContent,
  summarizeSonkeContent,
} from "./lib/sonke-content.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const pbsDir = join(publicDir, "pbs");
const dataDir = join(publicDir, "pbs", "data");
const assetsDir = join(publicDir, "pbs-assets");
const manifestPath = join(assetsDir, "manifest.json");
const contentDir = join(root, "content");

const pages = [
  { source: "pbs-home.html", dest: "index.html" },
  { source: "pbs-games.html", dest: "games.html" },
  { source: "pbs-videos.html", dest: "videos.html" },
];

const BRAND_KIDS = "Sonke Kids";
const BRAND_GAMES = "Sonke Games";

const SONKE_KIDS_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="101" height="101" fill="none" viewBox="0 0 101 101" role="img"><title>${BRAND_KIDS}</title><path d="M50 .8C22.385.8 0 23.186 0 50.8s22.385 50 50 50 50-22.385 50-50S77.61.8 50 .8" style="fill:#2638c4"></path><g class="letters-group letters-sonke"><text x="50.5" y="40" text-anchor="middle" fill="#99cf16" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="12.5">SONKE</text></g><g class="letters-group letters-kids"><text x="50.5" y="72" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="17">KIDS</text></g></svg>`;

const LOGO_SVG_PATTERN =
  /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="101" height="101" fill="none" viewBox="0 0 101 101" role="img">[\s\S]*?<\/svg>/g;

function getPageTitle(dest) {
  if (dest === "games.html") return BRAND_GAMES;
  if (dest === "videos.html") return `Videos | ${BRAND_KIDS}`;
  return BRAND_KIDS;
}

function applyTextReplacements(html, dest) {
  let branded = html;

  if (dest === "games.html") {
    branded = branded.replaceAll("Games | PBS KIDS", BRAND_GAMES);
  } else if (dest === "videos.html") {
    branded = branded.replaceAll("Videos | PBS KIDS", `Videos | ${BRAND_KIDS}`);
  }

  const replacements = [
    ["PBS Kids Shows", "Sonke Kids Worlds"],
    ["PBS KIDS Shows", "Sonke Kids Worlds"],
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

function scrubNextData(html, dest, sonkeContent) {
  return html.replace(
    /(<script id="__NEXT_DATA__" type="application\/json">)([\s\S]*?)(<\/script>)/,
    (_, open, json, close) => {
      let updated = applyTextReplacements(json, dest);
      if (sonkeContent) {
        updated = applySonkeContent(updated, sonkeContent);
      }
      return `${open}${updated}${close}`;
    },
  );
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

function stripServiceWorkerLoader(html) {
  return html.replace(/<script>\s*const loadSW[\s\S]*?<\/script>/, "");
}

function fixOrphanedScriptBeforeStyles(html) {
  return html.replace(
    /<script>\s*(<link rel="stylesheet"[\s\S]*?<\/head>)/,
    "$1",
  );
}

function stripAnalytics(html) {
  return html
    .replace(/<link rel="preconnect" href="\/\/www\.googletagmanager\.com"[^>]*>/g, "")
    .replace(
      /<noscript><iframe src="\/\/www\.googletagmanager\.com[^"]*"[\s\S]*?<\/iframe><\/noscript>/g,
      "",
    );
}

function injectSonkeContentPatch(html, sonkeContent) {
  const patch = buildSonkeContentPatch(sonkeContent);
  if (html.includes('id="__NEXT_DATA__"')) {
    return html.replace(
      /(<script id="__NEXT_DATA__" type="application\/json">[\s\S]*?<\/script>)/,
      `$1${patch}`,
    );
  }
  if (html.includes("</body>")) {
    return html.replace("</body>", `${patch}</body>`);
  }
  return `${html}${patch}`;
}

function injectLocalAssetsPatch(html, manifest) {
  return html.replace("<head>", `<head>${buildLocalAssetsPatch(manifest)}`);
}

function verifyDownloadedAssets(manifest, publicDir) {
  let missing = 0;
  for (const localPath of new Set(Object.values(manifest))) {
    const diskPath = join(publicDir, ...localPath.replace(/^\//, "").split("/"));
    if (!existsSync(diskPath)) {
      missing += 1;
      if (missing <= 5) {
        process.stderr.write(`  missing asset: ${localPath}\n`);
      }
    }
  }
  if (missing > 0) {
    throw new Error(`${missing} local assets are missing. Re-run npm run setup-pbs.`);
  }
}

function injectLightweightBrandingPatch(html, pageTitle) {
  const patch = `<script data-sonke-branding-patch>(function(){var title=${JSON.stringify(pageTitle)};var logo=${JSON.stringify(SONKE_KIDS_LOGO_SVG)};function fix(){document.title=title;document.querySelectorAll("title").forEach(function(node){node.textContent=title});document.querySelectorAll('[class*="copyright"]').forEach(function(node){if(/pbskids/i.test(node.textContent))node.textContent=node.textContent.replace(/pbskids\\.org/gi,"Sonke Kids")});var wrap=document.getElementById("logo-wrap");if(wrap){var svg=wrap.querySelector("svg");if(svg&&svg.querySelector(".letters-pbs"))svg.outerHTML=logo}}window.addEventListener("load",function(){fix();setTimeout(fix,800);setTimeout(fix,2500)})})();</script>`;
  return html.replace("</body>", `${patch}</body>`);
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

function ensureImgSrcFromSrcSet(html) {
  return html.replace(
    /<img\b((?:(?!\bsrc=)[^>])*)\bsrcSet="([^"]+)"([^>]*)>/gi,
    (match, before, srcSet, after) => {
      if (/\bsrc=/i.test(match)) {
        return match;
      }
      const firstUrl = srcSet.split(",")[0].trim().split(/\s+/)[0];
      return `<img${before}src="${firstUrl}" srcSet="${srcSet}"${after}>`;
    },
  );
}

function applyBranding(html, dest, sonkeContent) {
  let branded = applyTextReplacements(html, dest);
  if (sonkeContent) {
    branded = applySonkeContent(branded, sonkeContent);
  }
  branded = scrubNextData(branded, dest, sonkeContent);
  branded = replaceHeaderLogo(branded);
  branded = injectFavicon(branded);
  branded = stripAnalytics(branded);
  branded = updateWebManifest(branded);
  return injectLightweightBrandingPatch(branded, getPageTitle(dest));
}

function stripLegacyPatches(html) {
  return html.replace(/<script data-sonke-image-patch>[\s\S]*?<\/script>/g, "");
}

function processHtml(html, dest, sonkeContent) {
  return applyBranding(
    fixOrphanedScriptBeforeStyles(
      stripServiceWorkerLoader(
        ensureImgSrcFromSrcSet(
          stripLegacyPatches(
            html
              .replace(/href="https:\/\/pbskids\.org\/"/g, 'href="/"')
              .replace(/href="https:\/\/pbskids\.org\/games"/g, 'href="/games"')
              .replace(/href="https:\/\/pbskids\.org\/videos"/g, 'href="/videos"'),
          ),
        ),
      ),
    ),
    dest,
    sonkeContent,
  );
}

async function main() {
  mkdirSync(pbsDir, { recursive: true });
  mkdirSync(assetsDir, { recursive: true });

  const sonkeContent = loadSonkeContent(contentDir);
  const summary = summarizeSonkeContent(sonkeContent);
  console.log(
    `Applying Sonke content: ${summary.worlds} worlds, ${summary.propertyMappings} property mappings, ${summary.gameOverrides} game overrides, ${summary.videoOverrides} video overrides.`,
  );

  const brandedPages = [];
  const allImageUrls = new Set();

  for (const { source, dest } of pages) {
    const sourcePath = join(publicDir, source);
    const raw = readFileSync(sourcePath, "utf8");
    const branded = processHtml(raw, dest, sonkeContent);
    for (const url of collectRemoteImageUrls(branded)) {
      allImageUrls.add(url);
    }
    brandedPages.push({ dest, branded });
  }

  console.log(`Extracting ${allImageUrls.size} images to public/pbs-assets/ ...`);
  const { manifest, downloaded, skipped, failed } = await downloadAssets({
    publicDir,
    urls: allImageUrls,
    manifestPath,
  });
  console.log(
    `Assets ready: ${downloaded} downloaded, ${skipped} cached, ${failed} failed.`,
  );

  if (failed > 0) {
    throw new Error(`${failed} assets failed to download.`);
  }

  verifyDownloadedAssets(manifest, publicDir);

  for (const { dest, branded } of brandedPages) {
    let localized = injectLocalAssetsPatch(localizeImageUrls(branded, manifest), manifest);
    localized = applySonkeContent(localized, sonkeContent);
    localized = injectSonkeContentPatch(localized, sonkeContent);
    writeFileSync(join(pbsDir, dest), localized, "utf8");
    extractNextData(localized, dest, dataDir);
    console.log(`Wrote public/pbs/${dest} and public/pbs/data/${dest.replace(".html", ".json")}`);
  }

  console.log("Sonke Kids pages ready with local assets.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
