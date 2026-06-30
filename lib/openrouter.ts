import type { AiGameContent, SonkeGame } from "./games/types";
import type { GameTypeDefinition } from "./games/types";
import { buildFallbackContent } from "./games/fallback-content";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemma-2-9b-it:free";

export async function generateGameContent(
  game: SonkeGame,
  gameType: GameTypeDefinition,
  wikiExtract?: string,
): Promise<AiGameContent> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return buildFallbackContent(game, gameType);
  }

  const prompt = `You write for Sonke Kids, a cheerful educational site for children ages 4-8.

Game title: ${game.title}
Category: ${game.category}
Purpose: ${gameType.purpose}
How it works: ${gameType.howItWorks}
Skills: ${gameType.skills.join(", ")}
${wikiExtract ? `Background from Wikipedia: ${wikiExtract.slice(0, 500)}` : ""}

Return ONLY valid JSON with this shape:
{
  "tagline": "short exciting one line",
  "description": "2 friendly sentences about what kids will do and learn",
  "howToPlay": ["step 1", "step 2", "step 3"],
  "funFact": "one surprising kid-friendly fact",
  "learningGoals": ["skill1", "skill2", "skill3"]
}`;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://sonkekids.vercel.app",
        "X-Title": "Sonke Kids Games",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return buildFallbackContent(game, gameType);
    }

    const payload = await response.json();
    const text = payload?.choices?.[0]?.message?.content ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return buildFallbackContent(game, gameType);

    const parsed = JSON.parse(jsonMatch[0]) as AiGameContent;
    const fallback = buildFallbackContent(game, gameType);
    return {
      tagline: parsed.tagline || fallback.tagline,
      description: parsed.description || fallback.description,
      howToPlay: Array.isArray(parsed.howToPlay) && parsed.howToPlay.length > 0
        ? parsed.howToPlay.slice(0, 4)
        : fallback.howToPlay,
      funFact: parsed.funFact || fallback.funFact,
      learningGoals: Array.isArray(parsed.learningGoals) && parsed.learningGoals.length > 0
        ? parsed.learningGoals.slice(0, 5)
        : gameType.skills,
    };
  } catch {
    return buildFallbackContent(game, gameType);
  }
}
