import { readFileSync } from "fs";

const html = readFileSync("public/pbs/games.html", "utf8");
const match = html.match(
  /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
);

try {
  JSON.parse(match[1]);
  console.log("games __NEXT_DATA__: OK");
} catch (error) {
  console.log("games __NEXT_DATA__: BROKEN", error.message);
  const pos = Number(error.message.match(/position (\d+)/)?.[1] ?? 0);
  console.log(match[1].slice(Math.max(0, pos - 120), pos + 120));
}

for (const page of ["index.html", "videos.html"]) {
  const pageHtml = readFileSync(`public/pbs/${page}`, "utf8");
  const pageMatch = pageHtml.match(
    /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
  );
  try {
    JSON.parse(pageMatch[1]);
    console.log(`${page} __NEXT_DATA__: OK`);
  } catch (error) {
    console.log(`${page} __NEXT_DATA__: BROKEN`, error.message);
  }
}
