// ============================================================
//  app/api/spotify/route.ts  —  Edge API route
//  GET /api/spotify  →  returns current track or {isPlaying:false}
// ============================================================
import { NextResponse } from "next/server";
import { getNowPlaying }  from "@/lib/spotify";

// Run at the edge for lowest latency; revalidate every 30 s
export const runtime  = "edge";
export const revalidate = 30;

export async function GET() {
  const data = await getNowPlaying();

  return NextResponse.json(data, {
    status: 200,
    headers: {
      // Let the browser/CDN cache for 30 s
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
