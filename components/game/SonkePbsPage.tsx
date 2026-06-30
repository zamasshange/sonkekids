import type { ReactNode } from "react";
import { SonkeSiteHeader } from "./SonkeSiteHeader";

type SonkePbsPageProps = {
  pageTitle: string;
  children: ReactNode;
};

export function SonkePbsPage({ pageTitle, children }: SonkePbsPageProps) {
  return (
    <>
      <SonkeSiteHeader pageTitle={pageTitle} />
      <div data-component-page-section-stack="true" className="PageSectionStack_innerWrapper__FGyTf">
        {children}
      </div>
    </>
  );
}
