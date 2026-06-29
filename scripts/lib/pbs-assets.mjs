import crypto from "crypto";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { dirname, extname, join } from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

const PBS_ORIGIN = "https://pbskids.org";
const PBS_REFERER = "https://pbskids.org/";

const IMAGE_HOSTS = new Set([
  "image.pbs.org",
  "image.pbskids.org",
  "cms-assets.prod.pbskids.org",
  "cms-assets.pbskids.org",
]);

const URL_IN_TEXT =
  /https?:\/\/(?:image\.pbs(?:kids)?\.org|cms-assets(?:\.prod)?\.pbskids\.org)[^\s"'<>\\)]+/g;

const NEXT_IMAGE_IN_TEXT =
  /(?:https:\/\/pbskids\.org)?\/(?:api\/pbs-image|_next\/image)\?url=([^&"'\s<>]+)(?:&(?:amp;)?[^"'\s<>]*)?/g;

export function decodeNextImageTarget(encoded) {
  return decodeURIComponent(encoded.replace(/&amp;/g, "&"));
}

export function isImageRemoteUrl(url) {
  try {
    return IMAGE_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

export function normalizeRemoteUrl(raw) {
  if (!raw) {
    return null;
  }

  let cleaned = String(raw)
    .replace(/\\u0026.*$/g, "")
    .replace(/[),.;]+$/, "")
    .trim();

  try {
    const url = new URL(cleaned);
    if (!IMAGE_HOSTS.has(url.hostname)) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export function remoteUrlToLocalWebPath(remoteUrl) {
  const url = new URL(remoteUrl);
  const pathname = url.pathname.replace(/^\//, "");
  const ext = extname(pathname) || ".bin";

  if (url.search) {
    const baseName = pathname.slice(0, pathname.length - ext.length) || pathname;
    const hash = crypto.createHash("sha256").update(url.search).digest("hex").slice(0, 8);
    return `/pbs-assets/${url.hostname}/${baseName}_${hash}${ext}`;
  }

  const base = `/pbs-assets/${url.hostname}/${pathname}`;

  if (base.length <= 200) {
    return base;
  }

  const hash = crypto.createHash("sha256").update(remoteUrl).digest("hex").slice(0, 20);
  return `/pbs-assets/_hash/${hash}${ext}`;
}

function webPathToDiskPath(publicDir, webPath) {
  return join(publicDir, ...webPath.replace(/^\//, "").split("/"));
}

export function remoteUrlToDiskPath(publicDir, remoteUrl) {
  return webPathToDiskPath(publicDir, remoteUrlToLocalWebPath(remoteUrl));
}

export function collectRemoteImageUrls(html) {
  const urls = new Set();

  for (const match of html.matchAll(URL_IN_TEXT)) {
    const normalized = normalizeRemoteUrl(match[0]);
    if (normalized) {
      urls.add(normalized);
    }
  }

  for (const match of html.matchAll(NEXT_IMAGE_IN_TEXT)) {
    const normalized = normalizeRemoteUrl(decodeNextImageTarget(match[1]));
    if (normalized) {
      urls.add(normalized);
    }
  }

  return urls;
}

export function loadManifest(manifestPath) {
  if (!existsSync(manifestPath)) {
    return {};
  }
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, "utf8"));
    const cleaned = {};

    for (const [key, value] of Object.entries(parsed)) {
      const normalizedKey = normalizeRemoteUrl(key);
      if (!normalizedKey) {
        continue;
      }

      const localPath =
        typeof value === "string" && value.startsWith("/pbs-assets/") && !value.includes("undefined")
          ? value
          : remoteUrlToLocalWebPath(normalizedKey);
      cleaned[normalizedKey] = localPath;
    }

    return cleaned;
  } catch {
    return {};
  }
}

export function saveManifest(manifestPath, manifest) {
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
}

async function fetchWithRetry(url, options, retries = 4) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`);
}

async function downloadToFile(remoteUrl, diskPath) {
  mkdirSync(dirname(diskPath), { recursive: true });

  const attempts = [
    () => fetchWithRetry(remoteUrl, { headers: { Referer: PBS_REFERER } }),
    () =>
      fetchWithRetry(
        `${PBS_ORIGIN}/_next/image?url=${encodeURIComponent(remoteUrl)}&w=1920&q=75`,
        { headers: { Referer: PBS_REFERER } },
      ),
  ];

  for (const attempt of attempts) {
    try {
      const response = await attempt();
      const tempPath = `${diskPath}.tmp`;
      await pipeline(Readable.fromWeb(response.body), createWriteStream(tempPath));

      try {
        renameSync(tempPath, diskPath);
      } catch {
        if (existsSync(diskPath)) {
          unlinkSync(diskPath);
        }
        renameSync(tempPath, diskPath);
      }
      return;
    } catch {
      // Try the next download strategy.
    }
  }

  throw new Error(`Failed to download ${remoteUrl}`);
}

export async function downloadAssets({ publicDir, urls, manifestPath, concurrency = 6 }) {
  const manifest = loadManifest(manifestPath);
  const queue = [...urls]
    .map((url) => normalizeRemoteUrl(url))
    .filter((url) => url && isImageRemoteUrl(url));
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  async function worker() {
    while (queue.length > 0) {
      const remoteUrl = queue.shift();
      if (!remoteUrl) {
        return;
      }

      const localWebPath = manifest[remoteUrl] || remoteUrlToLocalWebPath(remoteUrl);
      const diskPath = webPathToDiskPath(publicDir, localWebPath);

      if (!manifest[remoteUrl]) {
        manifest[remoteUrl] = localWebPath;
      }

      if (existsSync(diskPath)) {
        skipped += 1;
        continue;
      }

      try {
        await downloadToFile(remoteUrl, diskPath);
        downloaded += 1;
      } catch (error) {
        failed += 1;
        process.stderr.write(`  failed ${remoteUrl}: ${error.message}\n`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  saveManifest(manifestPath, manifest);

  return { manifest, downloaded, skipped, failed, total: urls.size };
}

export function localizeImageUrls(html, manifest) {
  let localized = html;

  localized = localized.replace(
    /(?:https:\/\/pbskids\.org)?\/(?:api\/pbs-image|_next\/image)\?url=([^&"'\s<>]+)(?:&(?:amp;)?[^"'\s<>]*)?/g,
    (match, encoded) => {
      const remote = normalizeRemoteUrl(decodeNextImageTarget(encoded));
      return remote ? manifest[remote] || match : match;
    },
  );

  const remoteUrls = Object.keys(manifest).sort((a, b) => b.length - a.length);
  for (const remote of remoteUrls) {
    const local = manifest[remote];
    localized = localized.replaceAll(remote, local);
    localized = localized.replaceAll(remote.replace(/\//g, "\\/"), local.replace(/\//g, "\\/"));
  }

  return localized;
}

export function extractNextData(html, destName, dataDir) {
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) {
    return;
  }

  mkdirSync(dataDir, { recursive: true });
  const parsed = JSON.parse(match[1]);
  const fileName = destName.replace(/\.html$/, ".json");
  writeFileSync(join(dataDir, fileName), JSON.stringify(parsed, null, 2), "utf8");
}
