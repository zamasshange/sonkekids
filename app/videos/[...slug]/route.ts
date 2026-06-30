import { servePbsPage } from "@/lib/pbs-serve";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const pathname = `/videos/${slug.join("/")}`;

  const html = await servePbsPage(pathname);
  if (!html) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
