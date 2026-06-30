/**
 * Patch __NEXT_DATA__ so every PBS Game node gets the Sonke title and play URL.
 */
export function patchPbsGameData(html, slugMappings) {
  const byPbsSlug = Object.fromEntries(
    slugMappings.map((m) => [m.pbsSlug, { sonkeId: m.sonkeId, title: m.title }]),
  );
  const defaultPlay = slugMappings[0]
    ? `/games/${slugMappings[0].sonkeId}/play`
    : "/games/browse";

  return html.replace(
    /(<script id="__NEXT_DATA__" type="application\/json">)([\s\S]*?)(<\/script>)/,
    (_match, open, json, close) => {
      let data;
      try {
        data = JSON.parse(json);
      } catch {
        return `${open}${json}${close}`;
      }

      walk(data, (node) => {
        if (node?.__typename !== "Game" || !node.slug) return;
        const mapped = byPbsSlug[node.slug];
        if (mapped) {
          node.title = mapped.title;
        }
      });

      walk(data, (node) => {
        if (node?.__typename !== "MastheadContentModulesGamesVideosButtonsFeature") return;
        const reveal = node.revealTarget?.[0];
        if (reveal?.slug && byPbsSlug[reveal.slug]) {
          node.targetUrl = `/games/${byPbsSlug[reveal.slug].sonkeId}/play`;
        } else if (node.targetUrl) {
          node.targetUrl = defaultPlay;
        }
      });

      walk(data, (node) => {
        if (typeof node?.targetUrl === "string" && node.targetUrl.startsWith("/videos/")) {
          const show = node.targetUrl.replace(/^\/videos\//, "");
          if (byPbsSlug[show]) {
            node.targetUrl = `/games/${byPbsSlug[show].sonkeId}/play`;
          } else {
            node.targetUrl = defaultPlay;
          }
        }
      });

      return `${open}${JSON.stringify(data)}${close}`;
    },
  );
}

function walk(node, fn) {
  if (!node || typeof node !== "object") return;
  fn(node);
  if (Array.isArray(node)) {
    for (const item of node) walk(item, fn);
  } else {
    for (const value of Object.values(node)) walk(value, fn);
  }
}
