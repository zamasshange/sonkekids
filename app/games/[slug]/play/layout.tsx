import type { ReactNode } from "react";

/** Play pages use their own full-screen shell — skip the PBS games layout wrapper. */
export default function PlayLayout({ children }: { children: ReactNode }) {
  return children;
}
