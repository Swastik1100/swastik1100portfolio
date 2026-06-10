"use client";
// ============================================================
//  components/widgets/SpotifyWidget.tsx
//  Polls /api/spotify every 30s. Shows album art + animated
//  waveform bars when music is playing, or a "Not listening"
//  fallback.
// ============================================================
import { useState, useEffect } from "react";
import Image                    from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, ExternalLink }   from "lucide-react";
import type { SpotifyTrack }      from "@/types";

// ─── Animated waveform bars ───────────────────────────────────
function WaveformBars({ isPlaying }: { isPlaying: boolean }) {
  const BARS = [0.6, 1, 0.7, 0.9, 0.5, 0.8, 0.65, 1, 0.75];
  return (
    <div className="flex items-end gap-[3px] h-5">
      {BARS.map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-accent-green"
          animate={
            isPlaying
              ? { scaleY: [h * 0.3, h, h * 0.5, h * 0.8, h * 0.3] }
              : { scaleY: 0.3 }
          }
          transition={
            isPlaying
              ? { repeat: Infinity, duration: 0.8 + i * 0.07, ease: "easeInOut" }
              : { duration: 0.3 }
          }
          style={{ height: "20px", originY: 1 }}
        />
      ))}
    </div>
  );
}

export function SpotifyWidget() {
  const [track, setTrack]     = useState<SpotifyTrack>({ isPlaying: false });
  const [loading, setLoading] = useState(true);

  // ── Poll the /api/spotify endpoint ────────────────────────
  async function fetchTrack() {
    try {
      const res  = await fetch("/api/spotify");
      const data = await res.json() as SpotifyTrack;
      setTrack(data);
    } catch {
      setTrack({ isPlaying: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrack();
    const id = setInterval(fetchTrack, 30_000);
    return () => clearInterval(id);
  }, []);

  // ── Progress percentage ───────────────────────────────────
  const pct =
    track.progress && track.duration
      ? Math.round((track.progress / track.duration) * 100)
      : 0;

  return (
    <div
      className="
        relative h-full overflow-hidden rounded-2.5xl
        bg-bg-surface border border-border
        p-5 flex flex-col justify-between
        group hover:border-accent-green/30
        hover:shadow-glow-green transition-all duration-500
      "
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Spotify logomark (SVG inline to avoid external fetch) */}
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-accent-green" aria-hidden>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <span className="text-xs font-mono text-ink-secondary uppercase tracking-widest">
            Spotify
          </span>
        </div>

        <WaveformBars isPlaying={track.isPlaying} />
      </div>

      {/* ── Track info ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {loading ? (
          /* Skeleton */
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-14 h-14 rounded-lg bg-bg-elevated animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-bg-elevated rounded animate-pulse w-3/4" />
              <div className="h-3 bg-bg-elevated rounded animate-pulse w-1/2" />
            </div>
          </motion.div>
        ) : track.isPlaying ? (
          /* Now playing */
          <motion.div
            key={track.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y:  0 }}
            exit={{    opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            {/* Album art */}
            <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden">
              {track.albumArt ? (
                <Image
                  src={track.albumArt}
                  alt={track.album ?? "Album art"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
                  <Music2 size={20} className="text-ink-muted" />
                </div>
              )}
            </div>

            {/* Song metadata */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-primary truncate leading-tight">
                {track.title}
              </p>
              <p className="text-xs text-ink-secondary truncate mt-0.5">
                {track.artist}
              </p>
              <p className="text-[10px] text-ink-muted truncate mt-0.5 font-mono">
                {track.album}
              </p>
            </div>

            {track.songUrl && (
              <a
                href={track.songUrl}
                target="_blank"
                rel="noopener"
                className="text-ink-muted hover:text-accent-green transition-colors flex-shrink-0"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </motion.div>
        ) : (
          /* Not playing */
          <motion.div
            key="not-playing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            <div className="
              w-14 h-14 rounded-lg bg-bg-elevated
              flex items-center justify-center flex-shrink-0
            ">
              <Music2 size={22} className="text-ink-muted" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-primary">Not listening</p>
              <p className="text-xs text-ink-secondary mt-0.5">Currently in deep-work mode.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Progress bar (only when playing) ───────────────── */}
      {track.isPlaying && (
        <div className="mt-4">
          <div className="h-[2px] bg-bg-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent-green"
              initial={{ width: `${pct}%` }}
              animate={{ width: "100%" }}
              transition={{
                duration: track.duration ? (track.duration - (track.progress ?? 0)) / 1000 : 0,
                ease: "linear",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
