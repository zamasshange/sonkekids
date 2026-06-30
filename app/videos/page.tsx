import Link from "next/link";
import { getAllVideos } from "@/lib/videos/catalog";
import { SonkePbsPage } from "@/components/game/SonkePbsPage";
import { ContentModule, SectionHeading } from "@/components/game/content/shared";

export const metadata = {
  title: "Videos | Sonke Kids",
  description: "Watch fun learning videos for kids on Sonke Kids.",
};

export default function VideosPage() {
  const videos = getAllVideos();

  return (
    <SonkePbsPage pageTitle="Videos">
      <ContentModule className="sonke-game-hero-module">
        <div className="sonke-game-hero-copy">
          <p className="sonke-game-badge">Learning Videos</p>
          <h2 className="sonke-game-title">{videos.length} Videos to Watch</h2>
          <p className="sonke-game-tagline">
            Short, kid-friendly videos about math, reading, science, and more.
          </p>
          <Link href="/games" className="sonke-btn sonke-btn-play">
            Play Games
          </Link>
        </div>
      </ContentModule>

      <ContentModule className="sonke-related-module">
        <SectionHeading>All Videos</SectionHeading>
        <ul className="GamesCollage_gamesGrid__jv6Iv sonke-related-grid">
          {videos.map((video) => (
            <li key={video.id}>
              <Link href={`/videos/${video.id}`} className="MediaItem_mediaLink__JSobH sonke-related-card">
                <p className="MediaItem_heading__AybaX sonke-related-title">{video.title}</p>
                <p className="sonke-related-snippet">
                  {video.category} · ~{video.durationMinutes} min
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </ContentModule>
    </SonkePbsPage>
  );
}
