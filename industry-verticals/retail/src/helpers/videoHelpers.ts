/** A playable video source resolved from an author-supplied URL. */
export type VideoEmbed = { kind: 'embed'; src: string } | { kind: 'file'; src: string };

const FILE_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.ogv', '.mov', '.m4v'];

/** Base used so that relative media URLs still parse; never appears in output. */
const RELATIVE_BASE = 'https://relative.invalid';

const stripWww = (hostname: string): string => hostname.replace(/^www\./, '');

const getYouTubeId = (url: URL): string | null => {
  const host = stripWww(url.hostname);

  if (host === 'youtu.be') {
    return url.pathname.split('/').filter(Boolean)[0] ?? null;
  }

  if (host !== 'youtube.com' && host !== 'm.youtube.com' && host !== 'youtube-nocookie.com') {
    return null;
  }

  if (url.pathname === '/watch') {
    return url.searchParams.get('v');
  }

  return url.pathname.match(/^\/(?:embed|shorts|v|live)\/([^/]+)/)?.[1] ?? null;
};

const getVimeoId = (url: URL): string | null => {
  const host = stripWww(url.hostname);

  if (host === 'vimeo.com') {
    return url.pathname.split('/').filter(Boolean)[0] ?? null;
  }

  if (host === 'player.vimeo.com') {
    return url.pathname.match(/^\/video\/([^/]+)/)?.[1] ?? null;
  }

  return null;
};

/**
 * Adds a query parameter to a URL string, picking the correct separator.
 * @param {string} src - The URL to extend.
 * @param {string} key - The parameter name.
 * @param {string} value - The parameter value.
 * @returns {string} The URL with the parameter appended.
 */
export const appendQueryParam = (src: string, key: string, value: string): string =>
  `${src}${src.includes('?') ? '&' : '?'}${key}=${value}`;

/**
 * Resolves an author-supplied video URL into something the browser can play.
 *
 * Recognises YouTube (watch, youtu.be, embed, shorts, live), Vimeo, and direct
 * video files. Anything else returns null so the component can fall back.
 * @param {string} [rawUrl] - The URL from the datasource link field.
 * @returns {VideoEmbed | null} The resolved source, or null when unsupported.
 */
export const resolveVideoEmbed = (rawUrl?: string): VideoEmbed | null => {
  const trimmed = rawUrl?.trim();
  if (!trimmed) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(trimmed, RELATIVE_BASE);
  } catch {
    return null;
  }

  const youTubeId = getYouTubeId(url);
  if (youTubeId) {
    return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${youTubeId}?rel=0` };
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return { kind: 'embed', src: `https://player.vimeo.com/video/${vimeoId}?dnt=1` };
  }

  if (FILE_EXTENSIONS.some((extension) => url.pathname.toLowerCase().endsWith(extension))) {
    return { kind: 'file', src: trimmed };
  }

  return null;
};

/**
 * Picks a playable source from a pasted URL and/or a media-library file.
 * The link wins when both are set, so a YouTube URL is not overridden by a leftover file.
 * @param {string} [linkHref] - External or media URL from the Video Link field.
 * @param {string} [mediaSrc] - `src` from the media-library Video file field.
 * @returns {VideoEmbed | null} The resolved source, or null when neither is usable.
 */
export const resolveVideoSource = (linkHref?: string, mediaSrc?: string): VideoEmbed | null => {
  const fromLink = resolveVideoEmbed(linkHref);
  if (fromLink) {
    return fromLink;
  }

  const trimmedMedia = mediaSrc?.trim();
  return trimmedMedia ? { kind: 'file', src: trimmedMedia } : null;
};
