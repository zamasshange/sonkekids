import type { GamePageData, SonkeGame } from "./types";

export function buildSeoMetadata(data: Pick<GamePageData, "game" | "ai" | "heroImage" | "meta">): GamePageData["seo"] {
  const { game, ai, heroImage, meta } = data;
  const description = ai.description.slice(0, 155);

  return {
    title: `${game.title} | Sonke Kids Games`,
    description,
    keywords: meta.keywords,
    ogTitle: `${game.title} — Play & Learn on Sonke Kids`,
    ogDescription: ai.tagline,
    ogImage: heroImage,
  };
}

export function buildQuizFallback(game: SonkeGame, funFacts: string[]) {
  const topic = game.title.split(" ")[0];
  return [
    {
      question: `What kind of activity is ${game.title}?`,
      options: [game.category, "Sleeping", "Cooking dinner", "Driving a car"],
      answerIndex: 0,
    },
    {
      question: `Which age group is ${game.title} best for?`,
      options: ["Ages 4–9", "Adults only", "Babies only", "College students"],
      answerIndex: 0,
    },
    {
      question: "What is one thing you can learn while playing?",
      options: [
        game.category.replace(/ Games$/, "") + " skills",
        "How to fly a plane",
        "Advanced calculus",
        "Car repair",
      ],
      answerIndex: 0,
    },
    {
      question: "Did you know?",
      options: [funFacts[0] ?? "Games help your brain grow.", "Fish live on the Moon.", "Trees grow underground.", "Rain is made of candy."],
      answerIndex: 0,
    },
    {
      question: `What should you do if ${game.title} feels hard?`,
      options: ["Try again and ask for help", "Give up forever", "Throw the computer", "Hide under a blanket"],
      answerIndex: 0,
    },
  ];
}

export function buildActivityIdeas(game: SonkeGame): string[] {
  return [
    `Draw your favorite moment from ${game.title}.`,
    `Teach a friend or sibling how to play ${game.title}.`,
    `Make up a story about the characters in ${game.title}.`,
    `Find three real-world examples related to ${game.category.toLowerCase()}.`,
  ];
}

export function buildAdventureText(game: SonkeGame): string {
  return `Welcome, explorer! Your mission in ${game.title} is to learn, play, and discover new things about ${game.category.toLowerCase()}. Complete each challenge to earn your ${game.title} badge!`;
}

export function buildLearningBenefits(skills: string[]): string[] {
  const map: Record<string, string> = {
    memory: "Strengthens memory by practicing recall and pattern recognition.",
    logic: "Builds logical thinking through puzzles and decisions.",
    creativity: "Encourages creative expression and imagination.",
    science: "Sparks curiosity about how the world works.",
    "problem solving": "Teaches kids to break challenges into smaller steps.",
    focus: "Helps children practice attention and concentration.",
    rhythm: "Develops musical rhythm and listening skills.",
    geography: "Introduces places, cultures, and maps.",
    phonics: "Supports early reading and letter sounds.",
    numbers: "Builds confidence with counting and math ideas.",
  };

  return skills.map((skill) => map[skill.toLowerCase()] ?? `Develops ${skill} through playful practice.`);
}
