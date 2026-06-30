/**
 * Patches cloned PBS HTML to point at Sonke's simplified site (no show/video/PBS play URLs).
 */
export function simplifyPbsHtml(html, slugMap, videoIds) {
  let updated = html;

  // Show hubs → games browse
  updated = updated.replace(
    /href="\/(daniel|phoebeandjay|sesame|weatherhunters|carl|wildkratts|lyla|countonjunebug|rosiesrules|wombats|almasway|donkeyhodie|oddsquad|cityisland|arthur|pinkalicious|clifford|elinor|acousticrooster|jellybenandpogo|molly|xavier|naturecat|dinosaurtrain|scribblesandink|luna|heroelementary|cyberchase|ruff|humblemediagenius|curiousgeorge|catinthehat|peg|readyjetgo|superwhy|sid)"/gi,
    'href="/games/browse"',
  );

  // PBS play URLs → Sonke play pages (stay on site)
  updated = updated.replace(
    /href="\/games\/play\/([^/]+)\/[^"]*"/g,
    (_match, pbsSlug) => {
      const sonkeId = slugMap[pbsSlug];
      return sonkeId ? `href="/games/${sonkeId}/play"` : 'href="/games/browse"';
    },
  );

  // Direct game links → play shell
  updated = updated.replace(
    /href="\/games\/([^"/]+)"/g,
    (match, slug) => {
      if (slug === "browse" || slug === "search") return match;
      const sonkeId = slugMap[slug] ?? slug;
      return `href="/games/${sonkeId}/play"`;
    },
  );

  // Video episodes → our catalog (cycle through available videos) or /videos hub
  let videoIndex = 0;
  updated = updated.replace(/href="\/videos\/[^"]+"/g, () => {
    if (videoIndex < videoIds.length) {
      return `href="/videos/${videoIds[videoIndex++]}"`;
    }
    return 'href="/videos"';
  });

  updated = updated.replace(/href="\/pbskidsread"/g, 'href="/games/browse"');
  updated = updated.replace(
    /href="\/games\/(story-games|all-topics|spanish|community-games-topic-page|osgu-games)"/g,
    'href="/games/browse"',
  );

  return updated;
}
