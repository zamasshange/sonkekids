export function buildPbsCardStylesPatch() {
  return `<style data-sonke-card-titles>
.GamesCollage_gamesGrid__jv6Iv .MediaItem_mediaLink__JSobH,
.GamesCollage_gamesGrid__jv6Iv a[class*="MediaItem_mediaLink"] {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  text-decoration: none !important;
}
.GamesCollage_gamesGrid__jv6Iv .MediaItem_heading__AybaX,
.GamesCollage_gamesGrid__jv6Iv a[class*="MediaItem_mediaLink"] p,
.GamesCollage_gamesGrid__jv6Iv [class*="MediaItem_heading"] {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  clip: auto !important;
  width: auto !important;
  height: auto !important;
  margin: 0.4rem 0 0 !important;
  padding: 0.2rem 0.35rem 0.5rem !important;
  color: #2638c4 !important;
  font-family: "PBS Kids Headline", "Arial Rounded MT Bold", Arial, sans-serif !important;
  font-weight: 800 !important;
  font-size: clamp(0.85rem, 2.2vw, 1.05rem) !important;
  line-height: 1.15 !important;
  text-align: center !important;
  text-shadow: 0 1px 0 rgba(255,255,255,0.65) !important;
}
</style>`;
}
