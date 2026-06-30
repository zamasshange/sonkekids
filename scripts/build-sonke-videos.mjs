/**
 * Curated Sonke Kids video catalog.
 */
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const VIDEOS = [
  {
    title: "Counting to Ten",
    description: "Practice counting from 1 to 10 with fun animations.",
    category: "Math",
    youtubeId: "DR-cfDsHCGA",
    durationMinutes: 3,
  },
  {
    title: "Learn the Alphabet",
    description: "Sing along and learn letters A through Z.",
    category: "Reading",
    youtubeId: "lhX064AiyGg",
    durationMinutes: 4,
  },
  {
    title: "Animal Sounds",
    description: "Can you guess which animal makes each sound?",
    category: "Science",
    youtubeId: "pWepfJZaJW4",
    durationMinutes: 5,
  },
  {
    title: "Colors of the Rainbow",
    description: "Explore red, orange, yellow, green, blue, and purple.",
    category: "Art",
    youtubeId: "cR_8uQiIQnE",
    durationMinutes: 3,
  },
  {
    title: "Shapes All Around",
    description: "Find circles, squares, and triangles in everyday life.",
    category: "Math",
    youtubeId: "UvOVf2vC6zU",
    durationMinutes: 4,
  },
  {
    title: "Weather Wonders",
    description: "Learn about sun, rain, clouds, and wind.",
    category: "Science",
    youtubeId: "vH06uRntcYs",
    durationMinutes: 5,
  },
  {
    title: "Dinosaur Discovery",
    description: "Meet some favorite dinosaurs and learn fun facts.",
    category: "Science",
    youtubeId: "Qd6nLM2cKmk",
    durationMinutes: 6,
  },
  {
    title: "Space Adventure",
    description: "Blast off and explore planets in our solar system.",
    category: "Science",
    youtubeId: "libKVRa01L8",
    durationMinutes: 5,
  },
  {
    title: "Healthy Habits",
    description: "Wash your hands, eat veggies, and stay active!",
    category: "Life Skills",
    youtubeId: "mK6Uoqiv_z0",
    durationMinutes: 4,
  },
  {
    title: "Friendship & Sharing",
    description: "Stories about being kind and working together.",
    category: "Social",
    youtubeId: "O6JcE6yA8n8",
    durationMinutes: 5,
  },
  {
    title: "Music & Rhythm",
    description: "Clap, tap, and move to the beat.",
    category: "Music",
    youtubeId: "WqN-z9jrjYI",
    durationMinutes: 4,
  },
  {
    title: "Story Time",
    description: "A cozy read-aloud adventure for young learners.",
    category: "Reading",
    youtubeId: "jdMNoQE3mIQ",
    durationMinutes: 7,
  },
];

const videos = VIDEOS.map((video) => ({
  id: slugify(video.title),
  ...video,
}));

const output = {
  version: 1,
  totalVideos: videos.length,
  videos,
};

writeFileSync(
  join(root, "content", "sonke-videos-catalog.json"),
  `${JSON.stringify(output, null, 2)}\n`,
  "utf8",
);

console.log(`Wrote ${output.totalVideos} videos.`);
