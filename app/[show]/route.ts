import { NextRequest, NextResponse } from "next/server";

const CATEGORY_HINTS: Record<string, string> = {
  daniel: "puzzle-games",
  elinor: "puzzle-games",
  pinkalicious: "creative-games",
  molly: "maze-games",
  wildkratts: "quiz-games",
  weatherhunters: "quiz-games",
  sesame: "memory-games",
  lyla: "puzzle-games",
  arthur: "quiz-games",
  curiousgeorge: "creative-games",
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ show: string }> },
) {
  const { show } = await context.params;
  const category = CATEGORY_HINTS[show];
  const path = category ? `/games/browse?category=${category}` : "/games/browse";
  return NextResponse.redirect(new URL(path, request.url), 307);
}
