import type { ReactNode } from "react";
import {
  getPbsFontPreloads,
  getPbsStylesheetHrefs,
  getPbsThemeStyles,
} from "@/lib/pbs-shell";
import "@/components/game/game-page.css";

export default function GamesAppLayout({ children }: { children: ReactNode }) {
  const stylesheets = getPbsStylesheetHrefs();
  const fonts = getPbsFontPreloads();
  const themeStyles = getPbsThemeStyles();

  return (
    <>
      {fonts.map((font) => (
        <link
          key={font.href}
          rel="preload"
          href={font.href}
          as="font"
          type={font.type}
          crossOrigin="anonymous"
        />
      ))}
      {stylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="high" />
      ))}
      <link rel="icon" href="/sonke-favicon.svg" type="image/svg+xml" />
      {themeStyles ? (
        <style data-pbsk-theme-styles-source="sonke-games" dangerouslySetInnerHTML={{ __html: themeStyles }} />
      ) : null}
      <div className="_app_mainLayout__1tRjm sonke-pbs-shell">{children}</div>
    </>
  );
}
