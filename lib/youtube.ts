/**
 * lib/youtube.ts
 * ---------------------------------
 * Pulls TechInHausa's videos directly from YouTube, so new uploads show
 * up on the site automatically without anyone touching code.
 *
 * Setup needed once deployed:
 *   1. YOUTUBE_API_KEY   — a YouTube Data API v3 key (Google Cloud Console)
 *   2. YOUTUBE_CHANNEL_ID — TechInHausa's channel ID (starts with "UC...")
 *
 * Both go in the project's environment variables (.env.local locally,
 * or the Vercel dashboard in production). Nothing else needs to change.
 *
 * If the env vars aren't set (e.g. running locally before setup, or if
 * the API call fails), this falls back to sample data so the site still
 * renders instead of crashing.
 */

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
};

const FALLBACK_VIDEOS: Video[] = [
  {
    id: "fallback-1",
    title: "Me ne ChatGPT? Bayani a Harshen Hausa",
    description: "Koyi yadda ChatGPT ke aiki da yadda ake amfani da shi.",
    thumbnail: "",
    publishedAt: new Date().toISOString(),
    duration: "18:22",
  },
  {
    id: "fallback-2",
    title: "Python Programming: Darasi na Farko",
    description: "Fara koyon harshen Python daga farko, sannu a hankali.",
    thumbnail: "",
    publishedAt: new Date().toISOString(),
    duration: "22:10",
  },
  {
    id: "fallback-3",
    title: "Tsaro a Yanar Gizo: Kare Bayananku",
    description: "Muhimman shawarwari game da tsaro da kariyar bayanai.",
    thumbnail: "",
    publishedAt: new Date().toISOString(),
    duration: "15:45",
  },
  {
    id: "fallback-4",
    title: "Generative AI: Yadda Ake Kirkirar Hotuna da Rubutu",
    description:
      "Gabatarwa ga Generative AI - DALL-E, Midjourney, da ChatGPT. Koyi yadda AI ke ki...",
    thumbnail: "",
    publishedAt: new Date().toISOString(),
    duration: "20:33",
  },
  {
    id: "fallback-5",
    title: "MubeeTech - Sole Developer",
    description: "MubeeTech - Sole Developer",
    thumbnail: "",
    publishedAt: new Date().toISOString(),
    duration: "13:49",
  },
];

/**
 * Fetches the channel's uploads playlist, then the video details
 * (needed separately to get duration) for each item.
 * Revalidates once an hour so new uploads appear without a redeploy.
 */
export async function getLatestVideos(limit = 12): Promise<Video[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return FALLBACK_VIDEOS;
  }

  try {
    // Step 1: resolve the channel's "uploads" playlist ID
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
      { next: { revalidate: 3600 } },
    );
    const channelData = await channelRes.json();
    const uploadsPlaylistId =
      channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) return FALLBACK_VIDEOS;

    // Step 2: get the latest videos from that playlist
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${limit}&key=${apiKey}`,
      { next: { revalidate: 3600 } },
    );
    const playlistData = await playlistRes.json();

    const videoIds: string[] = (playlistData?.items ?? [])
      .map(
        (item: { snippet?: { resourceId?: { videoId?: string } } }) =>
          item.snippet?.resourceId?.videoId,
      )
      .filter(Boolean);

    if (videoIds.length === 0) return FALLBACK_VIDEOS;

    // Step 3: get durations for those videos
    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(
        ",",
      )}&key=${apiKey}`,
      { next: { revalidate: 3600 } },
    );
    const detailsData = await detailsRes.json();

    const videos: Video[] = (detailsData?.items ?? []).map(
      (item: {
        id: string;
        snippet: {
          title: string;
          description: string;
          publishedAt: string;
          thumbnails?: { high?: { url: string }; medium?: { url: string } };
        };
        contentDetails: { duration: string };
      }) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail:
          item.snippet.thumbnails?.high?.url ??
          item.snippet.thumbnails?.medium?.url ??
          "",
        publishedAt: item.snippet.publishedAt,
        duration: formatDuration(item.contentDetails.duration),
      }),
    );

    return videos.length > 0 ? videos : FALLBACK_VIDEOS;
  } catch {
    return FALLBACK_VIDEOS;
  }
}

/** Converts YouTube's ISO 8601 duration (e.g. "PT18M22S") to "18:22" */
function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const [, h, m, s] = match;
  const hours = h ? parseInt(h) : 0;
  const minutes = m ? parseInt(m) : 0;
  const seconds = s ? parseInt(s) : 0;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}
