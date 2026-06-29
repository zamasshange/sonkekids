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

function getPageTitle(dest) {
  if (dest === "games.html") return BRAND_GAMES;
  if (dest === "videos.html") return `Videos | ${BRAND_KIDS}`;
  return BRAND_KIDS;
}

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

function scrubNextData(html, dest) {
  return html.replace(
    /(<script id="__NEXT_DATA__" type="application\/json">)([\s\S]*?)(<\/script>)/,
    (_, open, json, close) => `${open}${applyTextReplacements(json, dest)}${close}`,
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
  // loadSW stripping used to leave <script> open, trapping stylesheet links inside it.
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

function applyBranding(html, dest) {
  let branded = applyTextReplacements(html, dest);
  branded = scrubNextData(branded, dest);
  branded = replaceHeaderLogo(branded);
  branded = injectFavicon(branded);
  branded = injectImageSrcPatch(branded);
  branded = stripAnalytics(branded);
  branded = updateWebManifest(branded);
  return injectLightweightBrandingPatch(branded, getPageTitle(dest));
}

function proxyNextImageUrls(html) {
  return html
    .replace(/\/_next\/image\?([^"'\s<>]+)/g, (_, query) =>
      `/api/pbs-image?${query.replace(/&amp;/g, "&")}`,
    )
    .replace(
      /https:\/\/pbskids\.org\/_next\/image\?([^"'\s<>]+)/g,
      (_, query) => `/api/pbs-image?${query.replace(/&amp;/g, "&")}`,
    );
}

function injectImageSrcPatch(html) {
  const patch = `<script data-sonke-image-patch>(function(){function toProxy(u){try{var parsed=new URL(u,location.origin);if(parsed.pathname!=="/_next/image")return u;return "/api/pbs-image"+parsed.search}catch(e){return u}}function rewrite(value){if(typeof value!=="string"||value.indexOf("/_next/image")===-1)return value;if(value.indexOf(",")!==-1)return value.split(",").map(function(part){var bits=part.trim().split(/\\s+/);bits[0]=toProxy(bits[0]);return bits.join(" ")}).join(", ");return toProxy(value)}function patchProto(proto,prop){var desc=Object.getOwnPropertyDescriptor(proto,prop);if(!desc||!desc.set)return;Object.defineProperty(proto,prop,{get:desc.get,set:function(v){desc.set.call(this,rewrite(v))},configurable:true,enumerable:desc.enumerable})}patchProto(HTMLImageElement.prototype,"src");patchProto(HTMLImageElement.prototype,"srcset");if(window.HTMLSourceElement){patchProto(HTMLSourceElement.prototype,"srcset")}var setAttribute=Element.prototype.setAttribute;Element.prototype.setAttribute=function(name,value){if((name==="src"||name==="srcset")&&typeof value==="string")value=rewrite(value);return setAttribute.call(this,name,value)};function fixAll(){document.querySelectorAll('img[src*="/_next/image"],img[srcset*="/_next/image"],source[srcset*="/_next/image"]').forEach(function(el){var src=el.getAttribute("src");if(src&&src.indexOf("/_next/image")!==-1)el.setAttribute("src",rewrite(src));var srcset=el.getAttribute("srcset");if(srcset&&srcset.indexOf("/_next/image")!==-1)el.setAttribute("srcset",rewrite(srcset))})}document.addEventListener("DOMContentLoaded",fixAll);window.addEventListener("load",function(){fixAll();setTimeout(fixAll,500);setTimeout(fixAll,2000)})})();</script>`;
  return html.replace("<head>", `<head>${patch}`);
}

function processHtml(html, dest) {
  return applyBranding(
    fixOrphanedScriptBeforeStyles(
      stripServiceWorkerLoader(
        proxyNextImageUrls(
          html
            .replace(/href="https:\/\/pbskids\.org\/"/g, 'href="/"')
            .replace(/href="https:\/\/pbskids\.org\/games"/g, 'href="/games"')
            .replace(/href="https:\/\/pbskids\.org\/videos"/g, 'href="/videos"'),
        ),
      ),
    ),
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
