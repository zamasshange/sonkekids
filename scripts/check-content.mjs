import { readFileSync } from "fs";

const html = readFileSync("public/pbs/index.html", "utf8");
const withoutNext = html.replace(/<script id="__NEXT_DATA__"[\s\S]*?<\/script>/, "");

for (const term of ["Phoebe", "Splashtastic", "Daniel Tiger", "Shows"]) {
  let index = 0;
  let count = 0;
  while ((index = withoutNext.indexOf(term, index)) !== -1 && count < 3) {
    console.log(`\n${term}:`, withoutNext.slice(Math.max(0, index - 60), index + term.length + 60));
    index += term.length;
    count += 1;
  }
}
