
/**
 * lib/youtube.ts
 *
 * Fetches recent videos from the configured public YouTube playlist.
 *
 * - No YouTube Data API key required.
 * - Uses YouTube's public playlist RSS feed.
 * - Caches successful feed responses for 15 minutes.
 * - Applies request timeouts and validates parsed video entries.
 * - Returns an empty array when the feed is unavailable.
 */

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
};

const PLAYLIST_ID = "PLXBKyxTE6bIg";
const CACHE_SECONDS = 900;
const REQUEST_TIMEOUT_MS = 8000;
const MAX_FEED_VIDEOS = 15;

const FEED_URL =
  `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(
    PLAYLIST_ID
  )}`;

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => {
      const number = Number(code);

      try {
        return Number.isSafeInteger(number) &&
          number >= 0 &&
          number <= 0x10ffff
          ? String.fromCodePoint(number)
          : "";
      } catch {
        return "";
      }
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => {
      const number = Number.parseInt(code, 16);

      try {
        return Number.isSafeInteger(number) &&
          number >= 0 &&
          number <= 0x10ffff
          ? String.fromCodePoint(number)
          : "";
      } catch {
        return "";
      }
    });
}

function getTag(xml: string, tag: string): string {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const match = xml.match(
    new RegExp(
      `<${escapedTag}(?:\\s[^>]*)?>([\\s\\S]*?)</${escapedTag}\\s*>`,
      "i"
    )
  );

  return match?.[1]?.trim() ?? "";
}

function getAttribute(
  xml: string,
  tag: string,
  attribute: string
): string {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const tagMatch = xml.match(
    new RegExp(`<${escapedTag}\\b([^>]*)\\/?>`, "i")
  );

  if (!tagMatch) return "";

  const escapedAttribute = attribute.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const attributeMatch = tagMatch[1].match(
    new RegExp(
      `\\b${escapedAttribute}\\s*=\\s*["']([^"']*)["']`,
      "i"
    )
  );

  return attributeMatch?.[1]
    ? decodeXml(attributeMatch[1])
    : "";
}

function parseVideoEntry(entry: string): Video | null {
  const id = decodeXml(getTag(entry, "yt:videoId"));

  // Standard YouTube video IDs contain exactly 11 URL-safe characters.
  if (!/^[\w-]{11}$/.test(id)) return null;

  const title = decodeXml(getTag(entry, "title"));
  const description = decodeXml(
    getTag(entry, "media:description")
  );
  const publishedAt = decodeXml(getTag(entry, "published"));
  const thumbnail = getAttribute(
    entry,
    "media:thumbnail",
    "url"
  );

  if (!title) return null;

  // Only accept valid timestamps. Invalid dates are omitted from display.
  const validPublishedAt =
    publishedAt && !Number.isNaN(Date.parse(publishedAt))
      ? publishedAt
      : "";

  // Avoid rendering unexpected URLs from malformed feed entries.
  const validThumbnail = (() => {
    try {
      const url = new URL(thumbnail);

      return url.protocol === "https:" &&
        (url.hostname === "i.ytimg.com" ||
          url.hostname.endsWith(".ytimg.com"))
        ? url.toString()
        : "";
    } catch {
      return "";
    }
  })();

  return {
    id,
    title,
    description,
    publishedAt: validPublishedAt,
    thumbnail: validThumbnail,
  };
}

export async function getLatestVideos(
  limit = 12
): Promise<Video[]> {
  const safeLimit = Math.min(
    Math.max(Math.floor(limit) || 1, 1),
    MAX_FEED_VIDEOS
  );

  try {
    const response = await fetch(FEED_URL, {
      headers: {
        Accept: "application/atom+xml, application/xml, text/xml",
        "User-Agent": "Mozilla/5.0 (compatible; TechInHausa/1.0)",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: {
        revalidate: CACHE_SECONDS,
      },
    });

    if (!response.ok) {
      console.error(
        `TechInHausa playlist feed returned HTTP ${response.status}.`
      );
      return [];
    }

    const contentType = response.headers.get("content-type") ?? "";

    // YouTube normally returns an XML/Atom feed. Some responses may
    // have a generic content type, so validate the body as well.
    const xml = await response.text();

    if (
      !xml.includes("<feed") ||
      (!contentType.includes("xml") &&
        !contentType.includes("atom") &&
        !xml.includes("<entry"))
    ) {
      console.error(
        "TechInHausa: YouTube returned an invalid playlist feed."
      );
      return [];
    }

    const entries =
      xml.match(/<entry(?:\s[^>]*)?>[\s\S]*?<\/entry>/gi) ?? [];

    const videos: Video[] = [];
    const seenIds = new Set<string>();

    for (const entry of entries) {
      const video = parseVideoEntry(entry);

      if (!video || seenIds.has(video.id)) continue;

      seenIds.add(video.id);
      videos.push(video);

      if (videos.length >= safeLimit) break;
    }

    return videos;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    console.error(
      "TechInHausa: Unable to fetch the YouTube playlist.",
      message
    );

    return [];
  }
}
