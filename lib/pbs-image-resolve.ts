export const IMAGE_HOSTS = new Set([
  "image.pbs.org",
  "image.pbskids.org",
  "cms-assets.prod.pbskids.org",
  "cms-assets.pbskids.org",
]);

export function decodeImageUrlParam(encoded: string): string {
  return decodeURIComponent(encoded.replace(/&amp;/g, "&"));
}

export function remoteUrlToLocalWebPath(remoteUrl: string): string | null {
  try {
    const url = new URL(remoteUrl);
    if (!IMAGE_HOSTS.has(url.hostname)) {
      return null;
    }

    return `/pbs-assets/${url.hostname}${url.pathname}`;
  } catch {
    return null;
  }
}

export function resolveImageRequest(
  urlParam: string | null,
  manifest: Record<string, string>,
): string | null {
  if (!urlParam) {
    return null;
  }

  const decoded = decodeImageUrlParam(urlParam);
  if (decoded.startsWith("/pbs-assets/")) {
    return decoded;
  }

  if (manifest[decoded]) {
    return manifest[decoded];
  }

  return remoteUrlToLocalWebPath(decoded);
}
