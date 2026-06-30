import Link from "next/link";
import { SONKE_LOGO_SVG } from "@/lib/sonke-branding";

type SonkeSiteHeaderProps = {
  pageTitle: string;
};

export function SonkeSiteHeader({ pageTitle }: SonkeSiteHeaderProps) {
  return (
    <div
      className="MastheadContentWrapper_outerWrapper__oDKFU"
      data-theme-context="masthead"
      data-masthead-content-layout=""
      data-masthead-content-module-name="MastheadContentModulesLookInsideGamePreview"
    >
      <header className="StandardHeader_outerWrapper__zM0jM StandardHeader_isTopLevelPage__qiptW">
        <h1 className="sr-only">{pageTitle}</h1>
        <nav aria-labelledby="site-nav-title" className="StandardHeader_innerWrapper__plvA5">
          <h2 id="site-nav-title" className="sr-only">
            Site Menu
          </h2>
          <div>
            <Link href="/" className="StandardHeader_navIconButton__sYlVr StandardHeader_pbsKidsLogo__coyGC">
              <div className="squish" data-animation-disabled="true">
                <div id="logo-wrap" className="AnimatedLogo_wrapper__r4Y_H">
                  <div dangerouslySetInnerHTML={{ __html: SONKE_LOGO_SVG }} />
                </div>
              </div>
            </Link>
            <Link
              className="NavButton_button__NtYeN StandardHeader_navIconButton__sYlVr"
              data-icon-name="games"
              href="/games"
            >
              <div className="squish" data-animation-disabled="true">
                <div data-nav-button-inner="true" className="NavButton_buttonInner__3WCOl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="42" height="22" viewBox="0 0 42 22" aria-hidden="true" className="StandardHeader_gamesIcon__hgfE1">
                    <path fill="var(--svg-icon-fill-color, #fff)" fillRule="evenodd" d="M31.493.2h.019c1.792.002 3.554.466 5.119 1.35a10.54 10.54 0 0 1 3.826 3.715 10.675 10.675 0 0 1 .389 10.36 10.56 10.56 0 0 1-3.537 3.995 10.413 10.413 0 0 1-10.244.775 10.5 10.5 0 0 1-4.088-3.42h-3.931a10.5 10.5 0 0 1-4.09 3.43 10.42 10.42 0 0 1-10.258-.768 10.57 10.57 0 0 1-3.543-4.001 10.68 10.68 0 0 1 .393-10.374 10.55 10.55 0 0 1 3.835-3.716A10.43 10.43 0 0 1 10.53.2zM9.28 5.501h2.652V9.48h3.971v2.652h-3.97v3.97H9.28v-3.97H5.3V9.48H9.28zm18.244 8.562a2.65 2.65 0 1 0 0-5.301 2.65 2.65 0 0 0 0 5.3m10.399-5.911a2.65 2.65 0 1 1-5.301 0 2.65 2.65 0 0 1 5.3 0" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
            <Link
              className="NavButton_button__NtYeN StandardHeader_navIconButton__sYlVr"
              data-icon-name="videos"
              href="/videos"
            >
              <div className="squish" data-animation-disabled="true">
                <div data-nav-button-inner="true" className="NavButton_buttonInner__3WCOl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="26" viewBox="0 0 36 26" aria-hidden="true" className="StandardHeader_videosIcon__Xo1iu">
                    <path fill="var(--svg-icon-fill-color, #fff)" d="M34.714 4.686A2.4 2.4 0 0 0 33.03 3.57l-8.857-3.4A2.4 2.4 0 0 0 20.8 2.17v15.657a2.4 2.4 0 0 0 3.372 2.2l8.857-3.4a2.4 2.4 0 0 0 1.686-2.286V4.686ZM2.4 0h12.8A2.4 2.4 0 0 1 17.6 2.4v21.2a2.4 2.4 0 0 1-2.4 2.4H2.4A2.4 2.4 0 0 1 0 23.6V2.4A2.4 2.4 0 0 1 2.4 0Z" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}
