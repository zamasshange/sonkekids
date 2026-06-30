import routeManifest from "@/content/pbs-route-manifest.json";

export function isGameDetailPath(pathname: string): boolean {
  const match = pathname.match(/^\/games\/([^/]+)$/);
  if (!match) return false;
  const slug = match[1];
  const reserved = new Set(["browse", "search", "play"]);
  if (reserved.has(slug)) return false;

  if (routeManifest.catalogGameSlugs.includes(slug)) return true;
  if (routeManifest.pbsGameSlugs.includes(slug)) return true;
  return false;
}

export function shouldServeAsPbsPage(pathname: string): boolean {
  if (pathname === "/" || pathname === "/games" || pathname === "/videos") return false;
  if (pathname.startsWith("/games/play/")) return false;
  if (pathname.startsWith("/games/browse") || pathname.startsWith("/games/search")) return false;
  if (isGameDetailPath(pathname)) return false;
  if (pathname === "/pbs-serve" || pathname.startsWith("/pbs-serve/")) return false;
  if (pathname.startsWith("/_next") || pathname.startsWith("/pbs-")) return false;
  if (pathname.startsWith("/pbs-assets")) return false;
  if (pathname.includes(".")) return false;

  if (routeManifest.pbsPages.includes(pathname)) return true;

  if (/^\/[a-z0-9]+$/i.test(pathname)) return true;
  if (pathname.startsWith("/videos/")) return true;
  if (pathname.startsWith("/games/")) return true;
  if (pathname === "/pbskidsread") return true;

  return false;
}
