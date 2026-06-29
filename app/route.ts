import { readFileSync } from "fs";
import { join } from "path";

function servePbsHtml(filename: string) {
  const html = readFileSync(
    join(process.cwd(), "public", "pbs", filename),
    "utf-8",
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function GET() {
  return servePbsHtml("index.html");
}
