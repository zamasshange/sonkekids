import { readFileSync } from "fs";
import { join } from "path";

const PBS_DIR = join(process.cwd(), "public", "pbs");

let indexHtml: string | null = null;
let gamesHtml: string | null = null;
let videosHtml: string | null = null;

function readCached(key: "index" | "games" | "videos"): string {
  if (key === "index") {
    if (!indexHtml) indexHtml = readFileSync(join(PBS_DIR, "index.html"), "utf8");
    return indexHtml;
  }
  if (key === "games") {
    if (!gamesHtml) gamesHtml = readFileSync(join(PBS_DIR, "games.html"), "utf8");
    return gamesHtml;
  }
  if (!videosHtml) videosHtml = readFileSync(join(PBS_DIR, "videos.html"), "utf8");
  return videosHtml;
}

export function getPbsIndexHtml() {
  return readCached("index");
}

export function getPbsGamesHtml() {
  return readCached("games");
}

export function getPbsVideosHtml() {
  return readCached("videos");
}
