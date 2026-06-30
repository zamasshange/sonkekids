import { redirect, notFound } from "next/navigation";
import { resolveSonkeGameId } from "@/lib/games/resolve-slug";

type PageProps = {
  params: Promise<{ slug: string; id?: string }>;
};

export default async function PbsGamePlayRedirect({ params }: PageProps) {
  const { slug } = await params;
  const sonkeId = resolveSonkeGameId(slug);

  if (!sonkeId) {
    notFound();
  }

  redirect(`/games/${sonkeId}`);
}
