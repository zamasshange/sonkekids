import { getPbsIndexHtml } from "@/lib/pbs-html-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const html = getPbsIndexHtml();

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
