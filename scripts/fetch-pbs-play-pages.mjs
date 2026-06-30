/**
 * Fetch PBS game play shells and cache them under public/pbs/play/.
 * Run after setup-pbs-clone (needs public/pbs/data/games.json).
 */
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  collectRemoteImageUrls,
  downloadAssets,
  localizeImageUrls,
} from "./lib/pbs-assets.mjs";
import { buildLocalAssetsPatch } from "./lib/local-assets-patch.mjs";
import {
  loadPbsPlayTargets,
  playPageFileName,
  playPagePath,
} from "./lib/pbs-games-index.mjs";
import { processPlayHtml } from "./lib/pbs-play-process.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const playDir = join(publicDir, "pbs", "play");
const manifestPath = join(publicDir, "pbs-assets", "manifest.json");

const PBS_ORIGIN = "https://pbskids.org";
const FETCH_DELAY_MS = 400;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPlayHtml(pbsSlug, pbsId) {
  const url = `${PBS_ORIGIN}/games/play/${pbsSlug}/${pbsId}`;
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "SonkeKidsSetup/1.0",
      referer: `${PBS_ORIGIN}/games`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}

async function main() {
  const targets = loadPbsPlayTargets();
  if (targets.length === 0) {
    console.log("No PBS play targets found. Run build-content and setup-pbs first.");
    return;
  }

  mkdirSync(playDir, { recursive: true });

  const index = targets.map((target) => ({
    pbsSlug: target.pbsSlug,
    pbsId: target.pbsId,
    sonkeId: target.sonkeId,
    title: target.title,
    playUrl: target.playUrl,
    file: playPageFileName(target.pbsSlug, target.pbsId),
  }));

  writeFileSync(
    join(playDir, "index.json"),
    `${JSON.stringify(index, null, 2)}\n`,
    "utf8",
  );

  const allImageUrls = new Set();
  const pendingWrites = [];

  console.log(`Fetching ${targets.length} PBS play pages...`);

  for (const target of targets) {
    const outPath = playPagePath(target.pbsSlug, target.pbsId);
    if (existsSync(outPath)) {
      console.log(`  skip cached ${target.playUrl}`);
      continue;
    }

    process.stdout.write(`  fetch ${target.playUrl} ... `);
    try {
      const raw = await fetchPlayHtml(target.pbsSlug, target.pbsId);
      const branded = processPlayHtml(raw, {
        pageTitle: `${target.title} | Sonke Kids`,
      });
      for (const url of collectRemoteImageUrls(branded)) {
        allImageUrls.add(url);
      }
      pendingWrites.push({ outPath, branded, target });
      console.log("ok");
    } catch (error) {
      console.log("failed");
      console.error(`    ${error.message}`);
    }

    await sleep(FETCH_DELAY_MS);
  }

  if (allImageUrls.size > 0) {
    console.log(`Downloading ${allImageUrls.size} play-page images...`);
    const { manifest, downloaded, skipped, failed } = await downloadAssets({
      publicDir,
      urls: allImageUrls,
      manifestPath,
    });
    console.log(
      `Play assets: ${downloaded} downloaded, ${skipped} cached, ${failed} failed.`,
    );

    if (failed > 0) {
      throw new Error(`${failed} play-page assets failed to download.`);
    }

    for (const item of pendingWrites) {
      let localized = localizeImageUrls(item.branded, manifest);
      localized = localized.replace(
        "<head>",
        `<head>${buildLocalAssetsPatch(manifest)}`,
      );
      writeFileSync(item.outPath, localized, "utf8");
      console.log(`  wrote public/pbs/play/${playPageFileName(item.target.pbsSlug, item.target.pbsId)}`);
    }
  } else {
    for (const item of pendingWrites) {
      writeFileSync(item.outPath, item.branded, "utf8");
      console.log(`  wrote public/pbs/play/${playPageFileName(item.target.pbsSlug, item.target.pbsId)}`);
    }
  }

  console.log(`Play pages ready (${index.length} indexed).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
