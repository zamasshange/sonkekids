import { readFileSync } from "fs";

const html = readFileSync("public/pbs/games.html", "utf8");
const match = html.match(
  /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
);
const data = match?.[1] ?? "";

const terms = [
  "Nature Cat",
  "Acoustic Rooster",
  "Summer Games",
  "Splashtastic",
  "Daniel Tiger",
  "Wild Kratts",
  "Stu's Super Stunts",
  "Mammals",
  "Quizzes",
  "Space Explorer",
];

for (const term of terms) {
  console.log(`${term}: ${data.includes(term) ? "YES" : "no"}`);
}
