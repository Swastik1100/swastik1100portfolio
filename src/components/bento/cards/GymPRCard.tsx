"use client";
// ============================================================
//  components/widgets/GymPRCard.tsx
//  Minimalist gym PR tracker with animated fill-bars.
//  Data: /data/gym-prs.json (static — update manually or
//  via a CI step that commits updated JSON).
// ============================================================
import { useRef }  from "react";
import { motion, useInView } from "framer-motion";
import { Dumbbell } from "lucide-react";
import gymData       from "@/data/gym-prs.json";
import type { GymData, GymLift } from "@/types";

// ─── Single lift row ─────────────────────────────────────────
function LiftRow({ lift, inView }: { lift: GymLift; inView: boolean }) {
  const pct = Math.min(100, Math.round((lift.current / lift.target) * 100));

  return (
    <div className="space-y-2">
      {/* Name + numbers */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="flex items-center gap-1.5 text-ink-secondary">
          <span>{lift.icon}</span>
          <span>{lift.name}</span>
        </span>
        <span className="text-ink-primary tabular-nums">
          <span className="font-bold text-sm">{lift.current}</span>
          <span className="text-ink-muted">/{lift.target} {lift.unit}</span>
        </span>
      </div>

      {/* Track */}
      <div className="h-[5px] bg-bg-elevated rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: pct >= 90
              ? "linear-gradient(90deg, #EF3B2D, #FF7A6B)"
              : pct >= 70
                ? "linear-gradient(90deg, #3B82F6, #60A5FA)"
                : "linear-gradient(90deg, #888, #aaa)",
          }}
          initial={{ width: "0%" }}
          animate={inView ? { width: `${pct}%` } : { width: "0%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export function GymPRCard() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const data   = gymData as unknown as GymData;

  return (
    <div
      ref={ref}
      className="
        relative h-full overflow-hidden rounded-2.5xl
        bg-bg-surface border border-border
        p-5 flex flex-col gap-4
        group hover:border-border-hover
        hover:shadow-card-hover
        transition-all duration-500
      "
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-red/10 flex items-center justify-center">
            <Dumbbell size={16} className="text-accent-red" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink-primary leading-none">Gym PRs</h3>
            <p className="text-[10px] font-mono text-ink-muted mt-0.5">
              Updated {data.lastUpdated}
            </p>
          </div>
        </div>
        {/* Weekly frequency badge */}
        <span className="
          text-[10px] font-mono text-accent-red
          border border-accent-red/20 bg-accent-red/5
          px-2 py-1 rounded-full
        ">
          {data.bodyStats?.trainingDays ?? 5}× / week
        </span>
      </div>

      {/* ── Lifts ──────────────────────────────────────────── */}
      <div className="space-y-4 flex-1">
        {data.lifts.map((lift) => (
          <LiftRow key={lift.name} lift={lift} inView={inView} />
        ))}
      </div>

      {/* ── Sprint highlight ───────────────────────────────── */}
      {data.sprints[0] && (
        <div className="
          border-t border-border pt-3
          flex items-center justify-between
        ">
          <span className="text-[11px] font-mono text-ink-muted">
            ⚡ Sprint {data.sprints[0].distance}
          </span>
          <span className="text-sm font-bold text-ink-primary font-mono tabular-nums">
            {data.sprints[0].time}
          </span>
        </div>
      )}
    </div>
  );
}
