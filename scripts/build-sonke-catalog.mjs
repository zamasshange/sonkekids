/**
 * Curated Sonke Kids catalog — focused learning games site (PBS look, quiz.com scale).
 */
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const CATALOG = {
  categories: [
    {
      id: "puzzle-games",
      title: "Puzzle Games",
      games: [
        "Animal Match",
        "Dinosaur Match",
        "Fruit Match",
        "Alphabet Match",
        "Number Match",
        "Color Match",
        "Shadow Match",
        "Shape Match",
      ],
    },
    {
      id: "maze-games",
      title: "Maze Games",
      games: [
        "Forest Maze",
        "Space Maze",
        "Pirate Maze",
        "Jungle Maze",
        "Castle Maze",
        "Underwater Maze",
      ],
    },
    {
      id: "memory-games",
      title: "Memory Games",
      games: [
        "Memory Cards",
        "Picture Pairs",
        "Emoji Memory",
        "Animal Memory",
        "Card Flip",
        "Music Memory",
      ],
    },
    {
      id: "quiz-games",
      title: "Quiz & Learn",
      games: [
        "Odd One Out",
        "Spot the Difference",
        "Count the Animals",
        "Rhyming Words",
        "Math Memory",
      ],
    },
    {
      id: "creative-games",
      title: "Creative Play",
      games: [
        "Color Animals",
        "Free Draw",
        "Beat Maker",
        "Pizza Maker",
        "Treasure Hunt",
      ],
    },
  ],
};

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const flat = [];
for (const category of CATALOG.categories) {
  for (const title of category.games) {
    flat.push({
      id: slugify(title),
      title,
      categoryId: category.id,
      category: category.title,
    });
  }
}

const output = {
  version: 2,
  totalGames: flat.length,
  totalCategories: CATALOG.categories.length,
  categories: CATALOG.categories.map((category) => ({
    id: category.id,
    title: category.title,
    count: category.games.length,
    games: category.games.map((title) => ({ id: slugify(title), title })),
  })),
  games: flat,
};

writeFileSync(
  join(root, "content", "sonke-games-catalog.json"),
  `${JSON.stringify(output, null, 2)}\n`,
  "utf8",
);

console.log(`Wrote ${output.totalGames} games in ${output.totalCategories} categories.`);
