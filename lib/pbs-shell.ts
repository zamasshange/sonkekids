import { readFileSync } from "fs";
import { join } from "path";

export function getPbsStylesheetHrefs(): string[] {
  const html = readFileSync(join(process.cwd(), "public", "pbs", "games.html"), "utf8");
  return [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((match) => match[1]);
}

export const SONKE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="101" height="101" fill="none" viewBox="0 0 101 101" role="img"><title>Sonke Kids</title><path d="M50 .8C22.385.8 0 23.186 0 50.8s22.385 50 50 50 50-22.385 50-50S77.61.8 50 .8" style="fill:#2638c4"></path><g class="letters-group letters-sonke"><text x="50.5" y="40" text-anchor="middle" fill="#99cf16" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="12.5">SONKE</text></g><g class="letters-group letters-kids"><text x="50.5" y="72" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="17">KIDS</text></g></svg>`;

export const PBS_GAME_THEME_STYLE = `
[data-theme-context='masthead'][data-masthead-content-layout] {
  --pbsk-theme-bodyBackgroundColor: #f7e03b;
  --pbsk-theme-featureBackgroundColor: #bc005a;
  --pbsk-theme-uiControlColor: #e5296b;
  --pbsk-theme-calloutBackgroundColor: #e5296b;
  --pbsk-theme-badgeBackgroundColor: #0081ca;
}
[data-theme-context='module'][data-theme-module-contextid='sonke-game'] {
  --pbsk-theme-bodyBackgroundColor: #ffffff;
  --pbsk-theme-featureBackgroundColor: #2638c4;
  --pbsk-theme-uiControlColor: #99cf16;
  --pbsk-theme-calloutBackgroundColor: #e5296b;
  --pbsk-theme-badgeBackgroundColor: #0081ca;
}
`;
