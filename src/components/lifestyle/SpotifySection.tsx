"use client";
// ============================================================
//  components/lifestyle/SpotifySection.tsx
//  Full-screen immersive Spotify "Now Playing" section with
//  large album art, animated waveform, and green gradient.
// ============================================================
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Music2, ExternalLink } from "lucide-react";
import type { SpotifyTrack } from "@/types";

// ─── Animated waveform bars (9 bars) ─────────────────────────
function WaveformBars({ isPlaying }: { isPlaying: boolean }) {
  const BARS = [0.6, 1, 0.7, 0.9, 0.5, 0.8, 0.65, 1, 0.75];
  return (
    <div className="flex items-end gap-[4px] h-8">
      {BARS.map((h, i) => (
        <motion.div
          key={i}
          className="w-[4px] rounded-full bg-accent-green"
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
          style={{ height: "32px", originY: 1 }}
        />
      ))}
    </div>
  );
}

// ─── Main Section ────────────────────────────────────────────
export function SpotifySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [track, setTrack] = useState<SpotifyTrack>({ isPlaying: false });
  const [loading, setLoading] = useState(true);

  // ── Poll /api/spotify every 30 s ──────────────────────────
  async function fetchTrack() {
    try {
      const res = await fetch("/api/spotify");
      const data = (await res.json()) as SpotifyTrack;
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

  // ── Progress ──────────────────────────────────────────────
  const pct =
    track.progress && track.duration
      ? Math.round((track.progress / track.duration) * 100)
      : 0;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden"
    >
      {/* ── Green gradient overlay when playing ──────────────── */}
      {track.isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(30,215,96,0.06) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* ── Section label ──────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2"
        >
          (Music)
        </motion.p>

        {/* ── Heading ────────────────────────────────────────── */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-black text-ink-primary mb-16"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          Now Playing
        </motion.h2>

        {/* ── Content ────────────────────────────────────────── */}
        {loading ? (
          /* Skeleton */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-[280px] h-[280px] rounded-2.5xl bg-bg-elevated animate-pulse" />
            <div className="space-y-3 w-64">
              <div className="h-6 bg-bg-elevated rounded animate-pulse w-3/4 mx-auto" />
              <div className="h-4 bg-bg-elevated rounded animate-pulse w-1/2 mx-auto" />
            </div>
          </motion.div>
        ) : track.isPlaying ? (
          /* ── Now playing state ─────────────────────────────── */
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Album art – large with glow */}
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl blur-3xl opacity-40"
                style={{ background: "rgba(30,215,96,0.35)" }}
              />
              <div className="relative w-[280px] h-[280px] rounded-2.5xl overflow-hidden shadow-card">
                {track.albumArt ? (
                  <Image
                    src={track.albumArt}
                    alt={track.album ?? "Album art"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
                    <Music2 size={64} className="text-ink-muted" />
                  </div>
                )}
              </div>
            </div>

            {/* Waveform */}
            <WaveformBars isPlaying={true} />

            {/* Track metadata */}
            <div className="space-y-1">
              <p className="text-2xl font-bold text-ink-primary truncate max-w-md">
                {track.title}
              </p>
              <p className="text-lg text-ink-secondary truncate max-w-md">
                {track.artist}
              </p>
              <p className="text-sm font-mono text-ink-muted truncate max-w-md">
                {track.album}
              </p>
            </div>

            {/* External link */}
            {track.songUrl && (
              <a
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2 text-sm font-mono text-ink-muted
                  hover:text-accent-green transition-colors
                "
              >
                Open in Spotify <ExternalLink size={14} />
              </a>
            )}

            {/* Progress bar – full width */}
            <div className="w-full max-w-md">
              <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent-green rounded-full"
                  initial={{ width: `${pct}%` }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: track.duration
                      ? (track.duration - (track.progress ?? 0)) / 1000
                      : 0,
                    ease: "linear",
                  }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── Not playing state ─────────────────────────────── */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-[280px] h-[280px] rounded-2.5xl bg-bg-surface border border-border flex items-center justify-center">
              <Music2 size={80} className="text-ink-muted" />
            </div>
            <WaveformBars isPlaying={false} />
            <div>
              <p className="text-2xl font-bold text-ink-primary">
                Not listening
              </p>
              <p className="text-lg text-ink-secondary mt-1">
                deep work mode
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
