/**
 * Shared HTML transforms for cached PBS play pages.
 */

const BRAND_KIDS = "Sonke Kids";

export const SONKE_KIDS_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="101" height="101" fill="none" viewBox="0 0 101 101" role="img"><title>${BRAND_KIDS}</title><path d="M50 .8C22.385.8 0 23.186 0 50.8s22.385 50 50 50 50-22.385 50-50S77.61.8 50 .8" style="fill:#2638c4"></path><g class="letters-group letters-sonke"><text x="50.5" y="40" text-anchor="middle" fill="#99cf16" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="12.5">SONKE</text></g><g class="letters-group letters-kids"><text x="50.5" y="72" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="17">KIDS</text></g></svg>`;

const LOGO_SVG_PATTERN =
  /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="101" height="101" fill="none" viewBox="0 0 101 101" role="img">[\s\S]*?<\/svg>/g;

export function rewritePbsChunkScripts(html) {
  return html
    .replace(/src="\/_next\/static\/chunks\//g, 'src="/pbs-proxy/_next/static/chunks/')
    .replace(/href="\/_next\/static\/chunks\//g, 'href="/pbs-proxy/_next/static/chunks/');
}

export function rewritePbsOrigins(html) {
  return html
    .replace(/href="https:\/\/pbskids\.org\/"/g, 'href="/"')
    .replace(/href="https:\/\/pbskids\.org\/games"/g, 'href="/games"')
    .replace(/href="https:\/\/pbskids\.org\/videos"/g, 'href="/videos"')
    .replace(/https:\/\/pbskids\.orghttps:\/\/pbskids\.org/g, "https://pbskids.org");
}

export function replaceHeaderLogo(html) {
  return html.replace(LOGO_SVG_PATTERN, SONKE_KIDS_LOGO_SVG);
}

export function injectFavicon(html) {
  const faviconTags =
    '<link rel="icon" href="/sonke-favicon.svg" type="image/svg+xml" data-sonke-favicon="true"/>' +
    '<link rel="apple-touch-icon" href="/sonke-favicon.svg" data-sonke-favicon="true"/>';

  let updated = html
    .replace(/<link rel="apple-touch-icon"[^>]*>/g, "")
    .replace(/<meta[^>]*PBSKidsLogo[^>]*>/g, "");

  if (!updated.includes("data-sonke-favicon")) {
    updated = updated.replace("<head>", `<head>${faviconTags}`);
  }

  return updated;
}

export function stripAnalytics(html) {
  return html
    .replace(/<link rel="preconnect" href="\/\/www\.googletagmanager\.com"[^>]*>/g, "")
    .replace(
      /<noscript><iframe src="\/\/www\.googletagmanager\.com[^"]*"[\s\S]*?<\/iframe><\/noscript>/g,
      "",
    );
}

export function stripServiceWorkerLoader(html) {
  return html.replace(/<script>\s*const loadSW[\s\S]*?<\/script>/, "");
}

export function fixOrphanedScriptBeforeStyles(html) {
  return html.replace(
    /<script>\s*(<link rel="stylesheet"[\s\S]*?<\/head>)/,
    "$1",
  );
}

export function ensureImgSrcFromSrcSet(html) {
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

export function injectPlayBrandingPatch(pageTitle) {
  const title = pageTitle.replace(/\|\s*PBS KIDS$/i, "| Sonke Kids");
  return `<script data-sonke-branding-patch>(function(){var title=${JSON.stringify(title)};var logo=${JSON.stringify(SONKE_KIDS_LOGO_SVG)};function fix(){document.title=title;document.querySelectorAll("title").forEach(function(node){node.textContent=title});document.querySelectorAll('[class*="copyright"]').forEach(function(node){if(/pbskids/i.test(node.textContent))node.textContent=node.textContent.replace(/pbskids\\.org/gi,"Sonke Kids")});var wrap=document.getElementById("logo-wrap");if(wrap){var svg=wrap.querySelector("svg");if(svg&&svg.querySelector(".letters-pbs"))svg.outerHTML=logo}}window.addEventListener("load",function(){fix();setTimeout(fix,800);setTimeout(fix,2500)})})();</script>`;
}

export function injectPlayLinkPatch() {
  return `<script data-sonke-play-links>(function(){function patch(){document.querySelectorAll('a[href^="https://pbskids.org"]').forEach(function(a){var href=a.getAttribute("href")||"";a.setAttribute("href",href.replace("https://pbskids.org",""))})}patch();document.addEventListener("DOMContentLoaded",patch);window.addEventListener("load",function(){patch();setTimeout(patch,1000)})})();</script>`;
}

export function processPlayHtml(html, { pageTitle }) {
  let processed = html;
  processed = rewritePbsOrigins(processed);
  processed = rewritePbsChunkScripts(processed);
  processed = replaceHeaderLogo(processed);
  processed = injectFavicon(processed);
  processed = stripAnalytics(processed);
  processed = stripServiceWorkerLoader(processed);
  processed = fixOrphanedScriptBeforeStyles(processed);
  processed = ensureImgSrcFromSrcSet(processed);
  processed = processed.replace(/PBS KIDS/g, BRAND_KIDS);

  if (processed.includes("</body>")) {
    processed = processed.replace(
      "</body>",
      `${injectPlayBrandingPatch(pageTitle)}${injectPlayLinkPatch()}</body>`,
    );
  }

  return processed;
}
