import type { SonkeGame } from "./types";

const TOPIC_FACTS: Record<string, string[]> = {
  animal: [
    "A giraffe's tongue can be over 45 cm long.",
    "Octopuses have three hearts.",
    "Elephants communicate through low vibrations.",
    "Dolphins sleep with one eye open.",
    "A group of flamingos is called a flamboyance.",
  ],
  ocean: [
    "The ocean covers more than 70% of Earth's surface.",
    "Blue whales are the largest animals ever known.",
    "Coral reefs are home to about 25% of all marine species.",
    "Some fish can change color to hide from predators.",
    "The deepest part of the ocean is over 10 km deep.",
  ],
  dinosaur: [
    "Birds are modern relatives of dinosaurs.",
    "Some dinosaurs had feathers.",
    "The word dinosaur means terrible lizard.",
    "Tyrannosaurus rex lived about 68 million years ago.",
    "Fossils help scientists learn about prehistoric life.",
  ],
  space: [
    "The Sun is a star at the center of our solar system.",
    "A day on Venus is longer than its year.",
    "There are more stars in the universe than grains of sand on Earth.",
    "Astronauts grow slightly taller in space.",
    "Jupiter has a storm called the Great Red Spot.",
  ],
  pirate: [
    "Pirates used maps and stars to navigate the seas.",
    "Ships need wind or engines to move across water.",
    "Treasure maps teach reading and direction skills.",
    "Compasses always point toward magnetic north.",
    "Sailing ships helped people explore new lands.",
  ],
  forest: [
    "Forests produce oxygen that helps us breathe.",
    "Trees can live for hundreds or even thousands of years.",
    "Owls can turn their heads almost all the way around.",
    "Squirrels hide nuts to find food in winter.",
    "Rainforests are home to more than half of Earth's plants and animals.",
  ],
  jungle: [
    "Jungles are warm, wet forests full of life.",
    "Toucans use their big beaks to reach fruit.",
    "Monkeys use their tails for balance in trees.",
    "Jungles get rain almost every day.",
    "Many medicines come from jungle plants.",
  ],
  math: [
    "Zero was invented to help us count nothing.",
    "Honeybees make hexagon shapes because they fit together perfectly.",
    "Patterns in nature often follow math rules.",
    "Playing games helps your brain practice numbers.",
    "Symmetry means both sides match like a butterfly's wings.",
  ],
  music: [
    "Music can help your brain remember things.",
    "Every song has rhythm, melody, and sometimes harmony.",
    "Drums are among the oldest musical instruments.",
    "Singing together helps people feel connected.",
    "Different notes create different moods in music.",
  ],
  weather: [
    "Rainbows appear when sunlight shines through raindrops.",
    "Lightning is hotter than the surface of the Sun.",
    "Clouds are made of tiny water droplets.",
    "Snowflakes always have six sides.",
    "Wind happens when air moves from one place to another.",
  ],
  food: [
    "Eating colorful fruits and vegetables helps you stay healthy.",
    "Chefs measure ingredients to make recipes work.",
    "Bread rises because yeast makes tiny bubbles.",
    "Your tongue has taste buds for sweet, salty, sour, and bitter.",
    "Farmers grow many of the foods we eat every day.",
  ],
  robot: [
    "Robots follow instructions called programs.",
    "Engineers design robots to help people with tasks.",
    "Some robots explore places too dangerous for humans.",
    "Sensors help robots see, hear, or feel their surroundings.",
    "Building things teaches problem solving and creativity.",
  ],
  castle: [
    "Castles were built to protect people long ago.",
    "Drawbridges could be raised to block visitors.",
    "Knights trained to be brave and helpful.",
    "Towers gave guards a view of the land around them.",
    "Moats are water trenches around castles.",
  ],
  ice: [
    "Ice is frozen water.",
    "Penguins slide on their bellies to move faster.",
    "Polar bears have thick fur to stay warm.",
    "Glaciers are giant rivers of slow-moving ice.",
    "Snow reflects sunlight and helps keep places cool.",
  ],
  color: [
    "Mixing red and blue makes purple.",
    "Primary colors are red, blue, and yellow.",
    "Artists use warm colors like red and cool colors like blue.",
    "Your eyes can see millions of different colors.",
    "Coloring helps practice focus and fine motor skills.",
  ],
};

const GENERIC_FACTS = [
  "Playing games helps your brain grow stronger connections.",
  "Taking turns teaches patience and fairness.",
  "Trying again after a mistake is how we learn.",
  "Curious kids ask great questions.",
  "Every game is a chance to discover something new.",
];

function extractTopics(game: SonkeGame): string[] {
  const text = `${game.id} ${game.title}`.toLowerCase();
  return Object.keys(TOPIC_FACTS).filter((topic) => text.includes(topic));
}

export function buildFunFacts(game: SonkeGame, count = 3): string[] {
  const topics = extractTopics(game);
  const pool: string[] = [];

  for (const topic of topics) {
    pool.push(...(TOPIC_FACTS[topic] ?? []));
  }

  if (pool.length < count) {
    pool.push(...GENERIC_FACTS);
  }

  const start = game.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const facts: string[] = [];

  for (let i = 0; i < count; i += 1) {
    facts.push(pool[(start + i * 7) % pool.length]);
  }

  return [...new Set(facts)].slice(0, count);
}

export function buildTips(game: SonkeGame, playerKind: string): string[] {
  const base = [
    `Take your time in ${game.title} — there is no rush!`,
    "Ask a grown-up to play the first round with you.",
    "Celebrate small wins and try again when something is tricky.",
  ];

  const byKind: Record<string, string[]> = {
    match: ["Try to remember where each card was before you flip it.", "Start with fewer pairs if the board feels hard."],
    maze: ["Plan your path before you move.", "Use arrow keys slowly at first."],
    "hidden-object": ["Scan the scene from left to right.", "Check the checklist before you tap."],
    coloring: ["Pick your favorite colors first.", "Stay inside the lines for neat pictures."],
    quiz: ["Read each question twice before answering.", "Eliminate answers you know are wrong."],
    music: ["Listen carefully before you tap.", "Clap the beat with your hands first."],
  };

  return [...(byKind[playerKind] ?? []), ...base].slice(0, 4);
}

export function buildWikiSearchTerms(game: SonkeGame): string[] {
  const title = game.title;
  const words = title.split(/\s+/).filter((w) => w.length > 2);
  const topics = extractTopics(game);

  const terms = [
    ...topics.map((t) => (t === "dinosaur" ? "dinosaur" : t)),
    ...words,
    title,
    `${words[0] ?? game.category} for children`,
    game.category.replace(/ Games$/, ""),
  ];

  return [...new Set(terms)].slice(0, 8);
}
