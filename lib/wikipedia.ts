import type { WikipediaData } from "./games/types";

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const WIKI_REST = "https://en.wikipedia.org/api/rest_v1/page/summary";

async function searchTitle(query: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    format: "json",
    origin: "*",
    srlimit: "1",
  });

  const response = await fetch(`${WIKI_API}?${params}`, {
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!response.ok) return null;

  const data = await response.json();
  const title = data?.query?.search?.[0]?.title;
  return typeof title === "string" ? title : null;
}

async function fetchSummary(title: string): Promise<WikipediaData | null> {
  const encoded = encodeURIComponent(title.replace(/ /g, "_"));
  const response = await fetch(`${WIKI_REST}/${encoded}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!response.ok) return null;

  const data = await response.json();
  if (data.type === "disambiguation" || !data.extract) return null;

  return {
    title: data.title ?? title,
    extract: data.extract ?? "",
    description: data.description ?? "",
    thumbnailUrl: data.thumbnail?.source ?? null,
    imageUrl: data.originalimage?.source ?? data.thumbnail?.source ?? null,
    pageUrl: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encoded}`,
  };
}

export async function fetchWikipediaForTerms(terms: string[]): Promise<WikipediaData | null> {
  for (const term of terms) {
    const title = await searchTitle(term);
    if (!title) continue;
    const summary = await fetchSummary(title);
    if (summary) return summary;
  }
  return null;
}
