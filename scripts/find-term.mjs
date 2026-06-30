import { readFileSync } from "fs";

function stripScripts(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/\/pbs-assets\/[^"'\s<>]+/g, "__ASSET__");
}

const html = stripScripts(readFileSync("public/pbs/games.html", "utf8"));
let index = 0;
let count = 0;
while ((index = html.indexOf("Daniel Tiger", index)) !== -1 && count < 10) {
  console.log(html.slice(Math.max(0, index - 100), index + 120));
  index += 1;
  count += 1;
}
