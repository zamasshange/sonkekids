import type { GamePageData } from "@/lib/games/types";
import { TemplateA, TemplateB, TemplateC, TemplateD } from "./layouts/templates";

const TEMPLATES = {
  A: TemplateA,
  B: TemplateB,
  C: TemplateC,
  D: TemplateD,
} as const;

export function GamePageView({ data }: { data: GamePageData }) {
  const Template = TEMPLATES[data.layout] ?? TemplateA;
  return <Template data={data} />;
}
