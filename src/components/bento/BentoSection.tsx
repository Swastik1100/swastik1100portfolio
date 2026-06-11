"use client";
// ============================================================
//  components/sections/BentoSection.tsx
//  The "Lifestyle Hub" — a responsive Bento Grid arranging:
//  - Spotify Now Playing (tall card)
//  - Gym PR Dashboard
//  - India Travel Map (large)
//  - WakaTime coding stats
//  - Games showcase
//  - Books shelf teaser
//  - /now status
// ============================================================
import { useRef, useCallback, useState }        from "react";
import { motion, useInView }                   from "framer-motion";
import { Clock, BookOpen, Gamepad2, Code2, Zap } from "lucide-react";
import { SpotifyWidget }  from "@/components/bento/cards/SpotifyWidget";
import { GymPRCard }      from "@/components/bento/cards/GymPRCard";
import { IndiaMapCard }   from "@/components/travel/IndiaMap";
import { TerminalWidget } from "@/components/terminal/TerminalWidget";
import wakaData           from "@/data/wakatime-stats.json";
import gamesData          from "@/data/games.json";
import booksData          from "@/data/books.json";
import type { WakaStats, Game, Book } from "@/types";

// ─── Shared card wrapper ──────────────────────────────────────
function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── /now card ────────────────────────────────────────────────
function NowCard() {
  return (
    <div className="
      h-full rounded-2.5xl bg-bg-surface border border-border
      p-5 flex flex-col gap-3
      hover:border-border-hover transition-all duration-300
    ">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-ink-muted" />
        <span className="text-xs font-mono text-ink-muted uppercase tracking-widest">/now</span>
      </div>
      <p className="text-sm font-bold text-ink-primary">June 2024</p>
      <ul className="space-y-2 text-xs text-ink-secondary font-mono leading-relaxed">
        <li>→ Building <span className="text-ink-primary">Velox</span> real-time chat</li>
        <li>→ Reading <span className="text-ink-primary">Deep Work</span> (65%)</li>
        <li>→ Training for <span className="text-ink-primary">150kg deadlift</span></li>
        <li>→ Planning <span className="text-ink-primary">Spiti Valley</span> trip</li>
        <li>→ Playing <span className="text-ink-primary">Baldur&apos;s Gate 3</span></li>
      </ul>
      <a
        href="/now"
        className="text-[10px] font-mono text-ink-muted hover:text-accent-red transition-colors mt-auto"
      >
        full /now page →
      </a>
    </div>
  );
}

// ─── WakaTime card ────────────────────────────────────────────
function WakaCard() {
  const data = wakaData as unknown as WakaStats;
  return (
    <div className="
      h-full rounded-2.5xl bg-bg-surface border border-border
      p-5 flex flex-col gap-3
      hover:border-border-hover transition-all duration-300
    ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-blue-400" />
          <span className="text-xs font-mono text-ink-muted uppercase tracking-widest">Code</span>
        </div>
        <span className="text-[10px] font-mono text-ink-muted">
          last 7 days
        </span>
      </div>
      <p className="text-2xl font-display font-black text-ink-primary leading-none">
        {data.totalHoursThisWeek}<span className="text-sm text-ink-secondary font-sans font-normal"> hrs</span>
      </p>
      <p className="text-[10px] font-mono text-ink-muted">avg {data.dailyAverage}/day</p>

      {/* Language bars */}
      <div className="space-y-2 mt-1">
        {data.topLanguages.slice(0, 4).map((lang) => (
          <div key={lang.name} className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-ink-secondary">{lang.name}</span>
              <span className="text-ink-muted">{lang.percent}%</span>
            </div>
            <div className="h-[3px] bg-bg-elevated rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: lang.color }}
                initial={{ width: "0%" }}
                whileInView={{ width: `${lang.percent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Gaming card ──────────────────────────────────────────────
function GamesCard() {
  const playing = (gamesData as Game[]).find((g) => g.status === "playing");
  const completed = (gamesData as Game[]).filter((g) => g.status === "completed");

  return (
    <div className="
      h-full rounded-2.5xl bg-bg-surface border border-border
      p-5 flex flex-col gap-3
      hover:border-border-hover transition-all duration-300
    ">
      <div className="flex items-center gap-2">
        <Gamepad2 size={14} className="text-purple-400" />
        <span className="text-xs font-mono text-ink-muted uppercase tracking-widest">Gaming</span>
      </div>

      {playing && (
        <div>
          <p className="text-[10px] font-mono text-accent-green mb-1">▶ Currently playing</p>
          <p className="text-sm font-bold text-ink-primary">{playing.title}</p>
          <p className="text-[10px] text-ink-muted font-mono">{playing.hours}h on record</p>
          <p className="text-xs text-ink-secondary mt-1 line-clamp-2">{playing.review}</p>
        </div>
      )}

      <div className="flex-1">
        <p className="text-[10px] font-mono text-ink-muted mb-2">Completed ({completed.length})</p>
        <div className="flex flex-wrap gap-1.5">
          {completed.map((g) => (
            <span
              key={g.id}
              className="text-[10px] px-2 py-0.5 rounded border border-border font-mono text-ink-secondary"
            >
              {g.title} ★{g.rating}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Books card ───────────────────────────────────────────────
function BooksCard() {
  const reading  = (booksData as Book[]).find((b) => b.status === "reading");
  const recent   = (booksData as Book[]).filter((b) => b.status === "read").slice(0, 3);

  return (
    <div className="
      h-full rounded-2.5xl bg-bg-surface border border-border
      p-5 flex flex-col gap-3
      hover:border-border-hover transition-all duration-300
    ">
      <div className="flex items-center gap-2">
        <BookOpen size={14} className="text-accent-amber" />
        <span className="text-xs font-mono text-ink-muted uppercase tracking-widest">Bookshelf</span>
      </div>

      {reading && (
        <div>
          <p className="text-[10px] font-mono text-accent-amber mb-1">📖 Reading now</p>
          <p className="text-sm font-bold text-ink-primary">{reading.title}</p>
          <p className="text-[10px] font-mono text-ink-muted mb-1">{reading.author}</p>
          <div className="h-[3px] bg-bg-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent-amber rounded-full"
              initial={{ width: "0%" }}
              whileInView={{ width: `${reading.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <p className="text-[10px] font-mono text-ink-muted mt-1">{reading.progress}% complete</p>
        </div>
      )}

      <div className="space-y-1.5">
        {recent.map((b) => (
          <div key={b.id} className="flex items-start gap-2">
            <span className="text-accent-green text-[10px] font-mono shrink-0 mt-[1px]">✓</span>
            <div>
              <p className="text-[11px] font-semibold text-ink-primary leading-tight">{b.title}</p>
              <p className="text-[9px] text-ink-muted font-mono line-clamp-1 mt-0.5">{b.takeaway}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────
interface Props {
  onMapStateHover?: (id: string) => void;
  onTerminalSecret?: () => void;
}

// ─── MAIN BENTO GRID ─────────────────────────────────────────
export function BentoSection({ onMapStateHover, onTerminalSecret }: Props) {
  const [hoveredStates, setHoveredStates] = useState(new Set<string>());

  const handleStateHover = useCallback(
    (id: string) => {
      setHoveredStates((prev) => {
        const next = new Set(prev).add(id);
        onMapStateHover?.(id);
        return next;
      });
    },
    [onMapStateHover]
  );

  return (
    <section
      id="lifestyle"
      className="relative bg-bg-primary px-6 lg:px-10 py-20 lg:py-28"
    >
      {/* ── Section header ─────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">
              (Lifestyle)
            </p>
            <h2
              className="font-display font-black text-ink-primary leading-none"
              style={{ fontSize: "clamp(36px, 5vw, 80px)" }}
            >
              Beyond Code
            </h2>
          </div>
          {/* Terminal button in the top-right of section */}
          <TerminalWidget onSecretCode={onTerminalSecret} />
        </div>

        {/* ── 12-column Bento Grid ───────────────────────────── */}
        {/*
          Layout on desktop (lg):
          [Spotify   3][Gym PR   3][WakaTime 3][/Now     3]  row 1 (short)
          [India Map       7     ][Games    5             ]  row 2 (tall)
          [Books     5           ][...future widget    7  ]  row 3
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-auto">

          {/* Spotify — col 1-3, short */}
          <BentoCard className="sm:col-span-1 lg:col-span-3 h-44" delay={0.0}>
            <SpotifyWidget />
          </BentoCard>

          {/* Gym PRs — col 4-6 */}
          <BentoCard className="sm:col-span-1 lg:col-span-3 h-44" delay={0.06}>
            <GymPRCard />
          </BentoCard>

          {/* WakaTime — col 7-9 */}
          <BentoCard className="sm:col-span-1 lg:col-span-3 h-44" delay={0.12}>
            <WakaCard />
          </BentoCard>

          {/* /Now — col 10-12 */}
          <BentoCard className="sm:col-span-1 lg:col-span-3 h-44" delay={0.18}>
            <NowCard />
          </BentoCard>

          {/* India Map — col 1-7, tall */}
          <BentoCard className="sm:col-span-2 lg:col-span-7 h-[420px]" delay={0.10}>
            <IndiaMapCard onStateHover={handleStateHover} />
          </BentoCard>

          {/* Games — col 8-12 */}
          <BentoCard className="sm:col-span-1 lg:col-span-5 h-[420px]" delay={0.16}>
            <GamesCard />
          </BentoCard>

          {/* Books — col 1-5 */}
          <BentoCard className="sm:col-span-1 lg:col-span-5 h-[260px]" delay={0.10}>
            <BooksCard />
          </BentoCard>

          {/* CTA card — col 6-12 */}
          <BentoCard className="sm:col-span-1 lg:col-span-7 h-[260px]" delay={0.16}>
            <div className="
              h-full rounded-2.5xl
              border border-accent-red/20
              bg-gradient-to-br from-accent-red/5 to-transparent
              p-6 flex flex-col justify-between
              group hover:border-accent-red/40
              hover:shadow-glow-red
              transition-all duration-500
              overflow-hidden
            ">
              {/* Large decorative text */}
              <p
                className="
                  font-display font-black leading-none
                  text-ink-primary/5
                  select-none
                  absolute bottom-0 right-0 pr-4
                "
                style={{ fontSize: "clamp(80px, 12vw, 160px)" }}
              >
                LET&apos;S<br />TALK
              </p>

              <div className="relative z-10">
                <Zap size={24} className="text-accent-red mb-3" />
                <h3 className="text-xl font-display font-black text-ink-primary mb-2">
                  Open to Work
                </h3>
                <p className="text-sm text-ink-secondary max-w-sm">
                  Looking for ambitious teams building things that matter.
                  SWE, founding engineer, or interesting contracts.
                </p>
              </div>

              <a
                href="mailto:hello@yourname.dev"
                className="
                  relative z-10 self-start
                  inline-flex items-center gap-2
                  px-5 py-2.5 rounded-full
                  bg-accent-red text-white
                  text-sm font-bold
                  hover:bg-accent-red/90
                  transition-colors
                "
              >
                hello@yourname.dev
              </a>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
