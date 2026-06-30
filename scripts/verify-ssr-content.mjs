import { readFileSync } from "fs";

function stripScripts(html) {
  return html
    .replace(/<script id="__NEXT_DATA__"[\s\S]*?<\/script>/, "")
    .replace(/<script data-sonke-content-patch>[\s\S]*?<\/script>/, "")
    .replace(/<script data-sonke-local-assets>[\s\S]*?<\/script>/, "")
    .replace(/<script data-sonke-branding>[\s\S]*?<\/script>/, "");
}

for (const page of ["index.html", "games.html", "videos.html"]) {
  const html = stripScripts(readFileSync(`public/pbs/${page}`, "utf8"));
  console.log(`\n=== ${page} ===`);
  for (const term of [
    "Wonder Woods",
    "Daniel Tiger",
    "Imagination Kingdom",
    "Beach Treasure Hunt",
    "Splashtastic Beach Day",
    "All Worlds",
    "Shows",
    "Worlds",
  ]) {
    const count = (html.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
    console.log(`  ${term}: ${count}`);
  }
}
