import type { AiGameContent, SonkeGame } from "./games/types";
import type { GameTypeDefinition } from "./games/types";
import { buildFallbackContent } from "./games/fallback-content";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemma-2-9b-it:free";

export async function generateGameContent(
  game: SonkeGame,
  gameType: GameTypeDefinition,
  wikiExtract?: string,
): Promise<Partial<AiGameContent>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return buildFallbackContent(game, gameType);
  }

  const prompt = `You write for Sonke Kids, a cheerful educational site for children ages 4-8.
Tone: curious, friendly, encouraging, simple, positive, educational.

Game title: ${game.title}
Category: ${game.category}
Purpose: ${gameType.purpose}
How it works: ${gameType.howItWorks}
Skills: ${gameType.skills.join(", ")}
${wikiExtract ? `Background from Wikipedia: ${wikiExtract.slice(0, 600)}` : ""}

Return ONLY valid JSON with this shape:
{
  "tagline": "short exciting one line",
  "description": "2 friendly sentences about what kids will do and learn",
  "introduction": "3 sentences welcoming kids to this specific game",
  "howToPlay": ["step 1", "step 2", "step 3"],
  "tips": ["tip 1", "tip 2", "tip 3"],
  "funFacts": ["fact 1", "fact 2", "fact 3"],
  "funFact": "one surprising kid-friendly fact",
  "learningGoals": ["goal1", "goal2", "goal3"],
  "learningBenefits": ["benefit1", "benefit2", "benefit3"],
  "skillsDeveloped": ["skill1", "skill2", "skill3"],
  "activityIdeas": ["idea1", "idea2"],
  "adventureText": "2 sentences of adventure mission text for this game",
  "quizQuestions": [
    {"question": "...", "options": ["a","b","c","d"], "answerIndex": 0}
  ]
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
        temperature: 0.75,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      return buildFallbackContent(game, gameType);
    }

    const payload = await response.json();
    const text = payload?.choices?.[0]?.message?.content ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return buildFallbackContent(game, gameType);

    const parsed = JSON.parse(jsonMatch[0]) as Partial<AiGameContent>;
    const fallback = buildFallbackContent(game, gameType);

    return {
      tagline: parsed.tagline || fallback.tagline,
      description: parsed.description || fallback.description,
      introduction: parsed.introduction || fallback.introduction,
      howToPlay:
        Array.isArray(parsed.howToPlay) && parsed.howToPlay.length > 0
          ? parsed.howToPlay.slice(0, 4)
          : fallback.howToPlay,
      tips:
        Array.isArray(parsed.tips) && parsed.tips.length > 0
          ? parsed.tips.slice(0, 4)
          : fallback.tips,
      funFacts:
        Array.isArray(parsed.funFacts) && parsed.funFacts.length > 0
          ? parsed.funFacts.slice(0, 5)
          : fallback.funFacts,
      funFact: parsed.funFact || parsed.funFacts?.[0] || fallback.funFact,
      learningGoals:
        Array.isArray(parsed.learningGoals) && parsed.learningGoals.length > 0
          ? parsed.learningGoals.slice(0, 5)
          : fallback.learningGoals,
      learningBenefits:
        Array.isArray(parsed.learningBenefits) && parsed.learningBenefits.length > 0
          ? parsed.learningBenefits.slice(0, 5)
          : fallback.learningBenefits,
      skillsDeveloped:
        Array.isArray(parsed.skillsDeveloped) && parsed.skillsDeveloped.length > 0
          ? parsed.skillsDeveloped.slice(0, 5)
          : fallback.skillsDeveloped,
      quizQuestions:
        Array.isArray(parsed.quizQuestions) && parsed.quizQuestions.length > 0
          ? parsed.quizQuestions.slice(0, 5)
          : fallback.quizQuestions,
      activityIdeas:
        Array.isArray(parsed.activityIdeas) && parsed.activityIdeas.length > 0
          ? parsed.activityIdeas.slice(0, 4)
          : fallback.activityIdeas,
      adventureText: parsed.adventureText || fallback.adventureText,
    };
  } catch {
    return buildFallbackContent(game, gameType);
  }
}
