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

export { SONKE_LOGO_SVG } from "./sonke-branding";

/** @deprecated use getPbsThemeStyles() */
export const PBS_GAME_THEME_STYLE = "";
