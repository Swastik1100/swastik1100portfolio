"use client";
// ============================================================
//  GamingSection.tsx — Full-screen gaming showcase section
// ============================================================
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Gamepad2, Trophy, Clock } from "lucide-react";
import gamesData from "@/data/games.json";
import type { Game } from "@/types";

const games = gamesData as unknown as Game[];

// ─── Derived data ────────────────────────────────────────────
const currentlyPlaying = games.find((g) => g.status === "playing");
const completedGames = games.filter((g) => g.status === "completed");
const totalHours = games.reduce((s, g) => s + g.hours, 0);
const totalCompleted = completedGames.length;

// ─── Animation variants ─────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Rating stars (1-10, 10 stars) ───────────────────────────
function RatingStars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-accent-amber" : "text-ink-muted/20"}
          style={{ fontSize: size }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────
export function GamingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-bg-primary px-6 py-24 md:px-12 lg:px-20 xl:px-28"
    >
      {/* ── Header row ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
      >
        <div>
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">
            (Gaming)
          </p>
          <h2
            className="font-display font-black text-ink-primary leading-[0.95]"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
            }}
          >
            Games
          </h2>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <Clock size={16} className="text-accent-blue" />
              <p className="text-3xl font-display font-black text-ink-primary">
                {totalHours}
              </p>
            </div>
            <p className="text-xs font-mono text-ink-muted uppercase tracking-wider">
              Total Hours
            </p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <Trophy size={16} className="text-accent-amber" />
              <p className="text-3xl font-display font-black text-ink-primary">
                {totalCompleted}
              </p>
            </div>
            <p className="text-xs font-mono text-ink-muted uppercase tracking-wider">
              Completed
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Currently Playing — Hero Card ─────────────────────── */}
      {currentlyPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-16"
        >
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <Gamepad2 size={14} className="text-accent-green" />
            Currently Playing
          </p>

          <div
            className="
              relative overflow-hidden rounded-2.5xl
              border border-border
              p-8 md:p-10 lg:p-12
              transition-all duration-300
              hover:border-border-hover hover:shadow-card-hover
            "
          >
            {/* Background gradient from cover colour */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${currentlyPlaying.coverColor} 0%, transparent 50%)`,
                opacity: 0.15,
              }}
            />
            <div className="absolute inset-0 bg-bg-surface/80 pointer-events-none" />

            <div className="relative space-y-6">
              {/* Title row */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h3
                    className="font-display font-black text-ink-primary leading-tight"
                    style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
                  >
                    {currentlyPlaying.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-accent-blue/30 text-accent-blue bg-accent-blue/10">
                      {currentlyPlaying.platform}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-border text-ink-secondary bg-bg-elevated">
                      {currentlyPlaying.genre}
                    </span>
                  </div>
                </div>

                {/* Rating + hours */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-display font-black text-accent-amber">
                      {currentlyPlaying.rating}
                      <span className="text-base font-mono text-ink-muted">/10</span>
                    </p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <p className="text-xl font-display font-bold text-ink-primary">
                      {currentlyPlaying.hours}
                      <span className="text-xs font-mono text-ink-muted ml-1">hrs</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Review */}
              <p className="text-base text-ink-secondary leading-relaxed max-w-2xl">
                {currentlyPlaying.review}
              </p>

              <RatingStars rating={currentlyPlaying.rating} size={16} />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Completed Games Grid ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-6 flex items-center gap-2">
          <Trophy size={14} className="text-accent-amber" />
          Completed
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {completedGames.map((game) => (
            <motion.div
              key={game.id}
              variants={itemVariants}
              className="
                group relative overflow-hidden
                rounded-2.5xl bg-bg-surface border border-border
                p-6 transition-all duration-300
                hover:border-border-hover hover:shadow-card-hover
              "
            >
              {/* Subtle accent glow */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 0% 0%, ${game.coverColor}, transparent 50%)`,
                }}
              />

              <div className="relative space-y-3">
                {/* Title */}
                <h4 className="text-lg font-bold text-ink-primary group-hover:text-accent-blue transition-colors duration-200">
                  {game.title}
                </h4>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-accent-blue/30 text-accent-blue bg-accent-blue/10">
                    {game.platform}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-border text-ink-secondary bg-bg-elevated">
                    {game.genre}
                  </span>
                </div>

                {/* Hours + Rating row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-ink-muted" />
                    <span className="text-xs font-mono text-ink-secondary">
                      {game.hours} hrs
                    </span>
                  </div>
                  <RatingStars rating={game.rating} size={11} />
                </div>

                {/* Micro-review */}
                <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                  {game.review}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
