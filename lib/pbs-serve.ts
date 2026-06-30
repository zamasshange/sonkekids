import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PBS_ORIGIN = "https://pbskids.org";

export const SONKE_KIDS_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="101" height="101" fill="none" viewBox="0 0 101 101" role="img"><title>Sonke Kids</title><path d="M50 .8C22.385.8 0 23.186 0 50.8s22.385 50 50 50 50-22.385 50-50S77.61.8 50 .8" style="fill:#2638c4"></path><g class="letters-group letters-sonke"><text x="50.5" y="40" text-anchor="middle" fill="#99cf16" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="12.5">SONKE</text></g><g class="letters-group letters-kids"><text x="50.5" y="72" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="17">KIDS</text></g></svg>`;

const LOGO_PATTERN =
  /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="101" height="101" fill="none" viewBox="0 0 101 101" role="img">[\s\S]*?<\/svg>/g;

export function pathToCacheFile(pathname: string): string {
  const normalized = pathname.replace(/^\/+|\/+$/g, "") || "index";
  return normalized.replace(/\//g, "__") + ".html";
}

export function getPbsPagesDir(): string {
  return join(process.cwd(), "public", "pbs", "pages");
}

export function getCachedPbsPagePath(pathname: string): string | null {
  const file = join(getPbsPagesDir(), pathToCacheFile(pathname));
  return existsSync(file) ? file : null;
}

export function readCachedPbsPage(pathname: string): string | null {
  const file = getCachedPbsPagePath(pathname);
  if (!file) return null;
  return readFileSync(file, "utf8");
}

export function processPbsPageHtml(html: string, pageTitle?: string): string {
  let processed = html
    .replace(/href="https:\/\/pbskids\.org\/"/g, 'href="/"')
    .replace(/href="https:\/\/pbskids\.org\/games"/g, 'href="/games"')
    .replace(/href="https:\/\/pbskids\.org\/videos"/g, 'href="/videos"')
    .replace(/https:\/\/pbskids\.orghttps:\/\/pbskids\.org/g, "https://pbskids.org")
    .replace(/src="\/_next\/static\/chunks\//g, 'src="/pbs-proxy/_next/static/chunks/')
    .replace(/href="\/_next\/static\/chunks\//g, 'href="/pbs-proxy/_next/static/chunks/')
    .replace(LOGO_PATTERN, SONKE_KIDS_LOGO_SVG)
    .replace(/<link rel="preconnect" href="\/\/www\.googletagmanager\.com"[^>]*>/g, "")
    .replace(/PBS KIDS/g, "Sonke Kids");

  if (!processed.includes("data-sonke-favicon")) {
    processed = processed.replace(
      "<head>",
      '<head><link rel="icon" href="/sonke-favicon.svg" type="image/svg+xml"/>',
    );
  }

  const branding = `<script data-sonke-branding>(function(){function fix(){document.querySelectorAll('[class*="copyright"]').forEach(function(n){if(/pbskids/i.test(n.textContent))n.textContent=n.textContent.replace(/pbskids\\.org/gi,"Sonke Kids")});var w=document.getElementById("logo-wrap");if(w){var s=w.querySelector("svg");if(s&&s.querySelector(".letters-pbs"))s.outerHTML=${JSON.stringify(SONKE_KIDS_LOGO_SVG)}}}${pageTitle ? `document.title=${JSON.stringify(pageTitle)};` : ""}fix();window.addEventListener("load",function(){fix();setTimeout(fix,1000)})})();</script>`;

  if (processed.includes("</body>")) {
    processed = processed.replace("</body>", `${branding}</body>`);
  }

  return processed;
}

export async function fetchPbsPageHtml(pathname: string): Promise<string | null> {
  const url = `${PBS_ORIGIN}${pathname}`;
  try {
    const response = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        referer: `${PBS_ORIGIN}/`,
        "user-agent": "SonkeKids/1.0",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    const html = await response.text();
    if (!html.includes("<html")) return null;
    return processPbsPageHtml(html);
  } catch {
    return null;
  }
}

export async function servePbsPage(pathname: string): Promise<string | null> {
  const cached = readCachedPbsPage(pathname);
  if (cached) return cached;
  return fetchPbsPageHtml(pathname);
}
