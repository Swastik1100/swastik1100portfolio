// ============================================================
//  lib/spotify.ts  —  Server-side Spotify API helper
//  Uses the Authorization Code flow with refresh tokens.
//  All env vars are configured in Vercel → never in git.
// ============================================================

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

const TOKEN_URL   = "https://accounts.spotify.com/api/token";
const NOW_PLAYING = "https://api.spotify.com/v1/me/player/currently-playing";

// ─── Step 1: Exchange refresh token for an access token ──────
async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type:    "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
    // Don't cache — we need a fresh token every call
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Spotify token error: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

// ─── Step 2: Fetch currently-playing track ───────────────────
export async function getNowPlaying() {
  try {
    const token = await getAccessToken();

    const res = await fetch(NOW_PLAYING, {
      headers: { Authorization: `Bearer ${token}` },
      // Revalidate every 30 s at the edge
      next: { revalidate: 30 },
    });

    // 204 = nothing playing right now
    if (res.status === 204 || !res.ok) {
      return { isPlaying: false };
    }

    const track = await res.json();

    // Only handle music tracks (not podcasts)
    if (track.currently_playing_type !== "track") {
      return { isPlaying: false };
    }

    return {
      isPlaying:  track.is_playing                       as boolean,
      title:      track.item?.name                       as string,
      artist:     (track.item?.artists ?? [])
                    .map((a: { name: string }) => a.name)
                    .join(", ")                          as string,
      album:      track.item?.album?.name                as string,
      albumArt:   track.item?.album?.images?.[0]?.url   as string | undefined,
      songUrl:    track.item?.external_urls?.spotify     as string | undefined,
      progress:   track.progress_ms                      as number,
      duration:   track.item?.duration_ms               as number,
    };
  } catch {
    // Gracefully degrade — never crash the page for a widget
    return { isPlaying: false };
  }
}

// ─── SETUP INSTRUCTIONS (run once in your browser) ───────────
/*
  1. Go to https://developer.spotify.com/dashboard  →  Create app
     Redirect URI: http://localhost:3000/api/spotify/callback

  2. Get CLIENT_ID and CLIENT_SECRET from the dashboard.

  3. To get REFRESH_TOKEN, paste this URL in your browser
     (replace YOUR_CLIENT_ID):

     https://accounts.spotify.com/authorize?
       client_id=YOUR_CLIENT_ID
       &response_type=code
       &redirect_uri=http://localhost:3000/api/spotify/callback
       &scope=user-read-currently-playing

  4. After authorising, you'll be redirected to localhost with
     ?code=XXXX.  Exchange the code:

     curl -X POST https://accounts.spotify.com/api/token \
       -H "Content-Type: application/x-www-form-urlencoded" \
       -d "grant_type=authorization_code&code=XXXX&redirect_uri=http://localhost:3000/api/spotify/callback" \
       -u "CLIENT_ID:CLIENT_SECRET"

  5. Copy refresh_token from the JSON response.

  6. In Vercel → Project → Settings → Environment Variables, add:
       SPOTIFY_CLIENT_ID     = ...
       SPOTIFY_CLIENT_SECRET = ...
       SPOTIFY_REFRESH_TOKEN = ...
*/
