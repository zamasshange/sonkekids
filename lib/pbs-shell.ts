import { readFileSync } from "fs";
import { join } from "path";

const GAMES_HTML = join(process.cwd(), "public", "pbs", "games.html");

/** PBS games grid module context id — yellow summer pattern theme */
export const PBS_GAMES_MODULE_ID = "e8fb4aca";

export function getPbsStylesheetHrefs(): string[] {
  const html = readFileSync(GAMES_HTML, "utf8");
  return [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((match) => match[1]);
}

export function getPbsFontPreloads(): { href: string; type: string }[] {
  const html = readFileSync(GAMES_HTML, "utf8");
  return [
    ...html.matchAll(
      /<link rel="preload" href="(\/_next\/static\/media\/[^"]+)" as="font" type="([^"]+)"[^>]*crossorigin/g,
    ),
  ].map((match) => ({ href: match[1], type: match[2] }));
}

export function getPbsThemeStyles(): string {
  const html = readFileSync(GAMES_HTML, "utf8");
  const blocks = [
    ...html.matchAll(/<style[^>]*data-pbsk-theme-styles-source[^>]*>([\s\S]*?)<\/style>/g),
  ];
  if (blocks.length === 0) return "";
  return blocks.map((block) => block[1]).join("\n");
}

export const SONKE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="101" height="101" fill="none" viewBox="0 0 101 101" role="img"><title>Sonke Kids</title><path d="M50 .8C22.385.8 0 23.186 0 50.8s22.385 50 50 50 50-22.385 50-50S77.61.8 50 .8" style="fill:#2638c4"></path><g class="letters-group letters-sonke"><text x="50.5" y="40" text-anchor="middle" fill="#99cf16" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="12.5">SONKE</text></g><g class="letters-group letters-kids"><text x="50.5" y="72" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="17">KIDS</text></g></svg>`;

/** @deprecated use getPbsThemeStyles() */
export const PBS_GAME_THEME_STYLE = "";
