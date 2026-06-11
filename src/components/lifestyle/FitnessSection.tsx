"use client";
// ============================================================
//  components/lifestyle/FitnessSection.tsx
//  Full-screen immersive Gym PRs section with lift cards,
//  animated progress bars, mini history charts, and sprint
//  records.
// ============================================================
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Dumbbell, Zap, TrendingUp } from "lucide-react";
import gymData from "@/data/gym-prs.json";
import type { GymData, GymLift } from "@/types";

const data = gymData as unknown as GymData;

// ─── Helper: gradient class by progress % ────────────────────
function progressGradient(pct: number) {
  if (pct >= 90)
    return "bg-gradient-to-r from-accent-red/80 to-accent-red";
  if (pct >= 70)
    return "bg-gradient-to-r from-accent-blue/80 to-accent-blue";
  return "bg-gradient-to-r from-ink-muted/40 to-ink-muted/60";
}

// ─── Lift Card ───────────────────────────────────────────────
function LiftCard({
  lift,
  index,
}: {
  lift: GymLift;
  index: number;
}) {
  const maxWeight = Math.max(...lift.history.map((h) => h.weight));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="
        rounded-2.5xl bg-bg-surface border border-border p-8
        hover:border-border-hover hover:shadow-card-hover
        transition-all duration-500 flex flex-col gap-6
      "
    >
      {/* Icon + Name */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-4xl block mb-2">{lift.icon}</span>
          <p className="text-lg font-bold text-ink-primary">{lift.name}</p>
        </div>
        <TrendingUp size={20} className="text-ink-muted mt-1" />
      </div>

      {/* Current weight – big display */}
      <div>
        <p
          className="font-display font-black text-ink-primary leading-none"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          {lift.current}
          <span className="text-sm font-mono text-ink-muted ml-1">
            {lift.unit}
          </span>
        </p>
        <p className="text-sm text-ink-muted font-mono mt-1">
          Target: {lift.target} {lift.unit}
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest">
            Progress
          </p>
          <p className="text-sm font-bold text-ink-primary">{lift.progress}%</p>
        </div>
        <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${progressGradient(lift.progress)}`}
            initial={{ width: 0 }}
            whileInView={{ width: `${lift.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Mini history bar chart */}
      <div>
        <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-3">
          Monthly History
        </p>
        <div className="flex items-end gap-2 h-16">
          {lift.history.slice(-5).map((entry, i) => {
            const heightPct = (entry.weight / maxWeight) * 100;
            return (
              <div
                key={entry.date}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <motion.div
                  className={`w-full rounded-sm ${progressGradient(lift.progress)}`}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${heightPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                  style={{ minHeight: 4 }}
                />
                <span className="text-[9px] font-mono text-ink-muted">
                  {entry.date.split("-")[1]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Section ────────────────────────────────────────────
export function FitnessSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen px-6 py-24 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* ── Section label ──────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2"
        >
          (Fitness)
        </motion.p>

        {/* ── Heading ────────────────────────────────────────── */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-black text-ink-primary mb-16"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          Gym PRs
        </motion.h2>

        {/* ── Lift cards grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {data.lifts.map((lift, i) => (
            <LiftCard key={lift.name} lift={lift} index={i} />
          ))}
        </div>

        {/* ── Sprint records ─────────────────────────────────── */}
        {data.sprints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap size={20} className="text-accent-amber" />
              <p className="text-lg font-bold text-ink-primary">Sprint Records</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.sprints.map((sprint) => (
                <div
                  key={`${sprint.distance}-${sprint.date}`}
                  className="
                    rounded-2.5xl bg-bg-surface border border-border p-6
                    hover:border-border-hover transition-all duration-300
                  "
                >
                  <p className="font-display font-black text-2xl text-ink-primary">
                    {sprint.distance}
                  </p>
                  <p className="text-lg text-accent-amber font-bold mt-1">
                    {sprint.time}
                  </p>
                  <p className="text-xs font-mono text-ink-muted mt-2">
                    {sprint.date}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Stats row ──────────────────────────────────────── */}
        {data.bodyStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-8 justify-center"
          >
            <div className="flex items-center gap-3">
              <Dumbbell size={20} className="text-ink-muted" />
              <div>
                <p className="text-sm font-mono text-ink-muted uppercase tracking-widest">
                  Training
                </p>
                <p className="text-xl font-bold text-ink-primary">
                  {data.bodyStats.trainingDays}
                  <span className="text-sm font-normal text-ink-secondary ml-1">
                    days / week
                  </span>
                </p>
              </div>
            </div>

            <div className="w-px h-10 bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <TrendingUp size={20} className="text-ink-muted" />
              <div>
                <p className="text-sm font-mono text-ink-muted uppercase tracking-widest">
                  Body Weight
                </p>
                <p className="text-xl font-bold text-ink-primary">
                  {data.bodyStats.weight}
                  <span className="text-sm font-normal text-ink-secondary ml-1">
                    kg
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
