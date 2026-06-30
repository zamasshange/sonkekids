import type { ReactNode } from "react";
import { getPbsStylesheetHrefs, PBS_GAME_THEME_STYLE } from "@/lib/pbs-shell";
import "@/components/game/game-page.css";

export default function GamesAppLayout({ children }: { children: ReactNode }) {
  const stylesheets = getPbsStylesheetHrefs();

  return (
    <>
      {stylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="high" />
      ))}
      <link rel="icon" href="/sonke-favicon.svg" type="image/svg+xml" />
      <style data-sonke-game-theme dangerouslySetInnerHTML={{ __html: PBS_GAME_THEME_STYLE }} />
      <div className="_app_mainLayout__1tRjm sonke-pbs-shell">{children}</div>
    </>
  );
}
