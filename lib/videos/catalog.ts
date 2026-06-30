import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { SonkeVideo } from "./types";
export type { SonkeVideo };

type VideoCatalog = {
  videos: SonkeVideo[];
  totalVideos: number;
};

let cached: VideoCatalog | null = null;

function loadCatalog(): VideoCatalog {
  if (cached) return cached;
  const path = join(process.cwd(), "content", "sonke-videos-catalog.json");
  if (!existsSync(path)) {
    return { videos: [], totalVideos: 0 };
  }
  cached = JSON.parse(readFileSync(path, "utf8")) as VideoCatalog;
  return cached;
}

export function getAllVideos(): SonkeVideo[] {
  return loadCatalog().videos;
}

export function getVideoById(id: string): SonkeVideo | undefined {
  return loadCatalog().videos.find((video) => video.id === id);
}

export function getFeaturedVideos(limit = 6): SonkeVideo[] {
  return loadCatalog().videos.slice(0, limit);
}
