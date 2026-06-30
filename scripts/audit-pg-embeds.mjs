import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const catalog = JSON.parse(
  readFileSync(join(root, "content", "sonke-games-catalog.json"), "utf8"),
);

const PG_CDN = "https://cdn.primarygames.com/";

function isLocalEmbed(url) {
  try {
    const host = new URL(url).hostname;
    return host === "cdn.primarygames.com" && url.includes("/HTML5/");
  } catch {
    return false;
  }
}

async function auditUrl(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "SonkeKidsCatalog/1.0" },
    redirect: "follow",
  });
  const finalUrl = res.url;
  const xfo = res.headers.get("x-frame-options");
  const csp = res.headers.get("content-security-policy") ?? "";
  const html = (await res.text()).slice(0, 12000);
  const breakout =
    /top\.location|parent\.location|window\.top|breakout|_top/i.test(html) ||
    /target\s*=\s*['"]?_top/i.test(html);
  const externalHost = !finalUrl.startsWith(PG_CDN);

  return {
    ok: res.ok,
    finalUrl,
    xfo,
    frameAncestors: /frame-ancestors/i.test(csp),
    breakout,
    externalHost,
    local: isLocalEmbed(finalUrl) && !breakout,
  };
}

const pgGames = catalog.games.filter((g) => g.embedSource === "primarygames");

for (const game of pgGames) {
  const a = await auditUrl(game.embedUrl);
  const status = a.local ? "LOCAL" : "SKIP";
  console.log(
    `${status}\t${game.title}\n  embed: ${game.embedUrl}\n  final: ${a.finalUrl}\n  xfo=${a.xfo ?? "-"} breakout=${a.breakout} external=${a.externalHost}\n`,
  );
}
