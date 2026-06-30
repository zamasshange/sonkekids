import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SonkePbsPage } from "@/components/game/SonkePbsPage";
import { ContentModule, SectionHeading } from "@/components/game/content/shared";
import { getVideoById, getAllVideos, getFeaturedVideos } from "@/lib/videos/catalog";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllVideos().map((video) => ({ id: video.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const video = getVideoById(id);
  if (!video) return { title: "Video | Sonke Kids" };
  return {
    title: `${video.title} | Sonke Kids`,
    description: video.description,
  };
}

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;
  const video = getVideoById(id);
  if (!video) notFound();

  const moreVideos = getFeaturedVideos(6).filter((item) => item.id !== video.id);

  return (
    <SonkePbsPage pageTitle={video.title}>
      <ContentModule className="sonke-video-page" panel>
        <p className="sonke-game-badge">{video.category}</p>
        <h2 className="sonke-game-title">{video.title}</h2>
        <p className="sonke-game-tagline">{video.description}</p>
        <p className="sonke-meta-bar">
          <strong>Length:</strong> ~{video.durationMinutes} min
        </p>
        <div className="sonke-video-player">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="sonke-play-actions">
          <Link href="/videos" className="sonke-btn sonke-btn-secondary">
            All Videos
          </Link>
          <Link href="/games" className="sonke-btn sonke-btn-play">
            Play Games
          </Link>
        </div>
      </ContentModule>

      {moreVideos.length > 0 && (
        <ContentModule className="sonke-related-module">
          <SectionHeading>More Videos</SectionHeading>
          <ul className="GamesCollage_gamesGrid__jv6Iv sonke-related-grid">
            {moreVideos.map((item) => (
              <li key={item.id}>
                <Link href={`/videos/${item.id}`} className="MediaItem_mediaLink__JSobH sonke-related-card">
                  <p className="MediaItem_heading__AybaX sonke-related-title">{item.title}</p>
                  <p className="sonke-related-snippet">{item.category}</p>
                </Link>
              </li>
            ))}
          </ul>
        </ContentModule>
      )}
    </SonkePbsPage>
  );
}
