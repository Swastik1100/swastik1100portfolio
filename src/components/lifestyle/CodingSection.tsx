"use client";
// ============================================================
//  components/lifestyle/CodingSection.tsx
//  Full-screen immersive WakaTime coding stats section with
//  hero stat, language bars, project cards, and timestamps.
// ============================================================
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Folder, Clock } from "lucide-react";
import wakaData from "@/data/wakatime-stats.json";
import type { WakaStats } from "@/types";

const data = wakaData as unknown as WakaStats;

export function CodingSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen px-6 py-24 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* ── Section label ──────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2"
        >
          (Code)
        </motion.p>

        {/* ── Heading ────────────────────────────────────────── */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-black text-ink-primary mb-16"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          Coding Stats
        </motion.h2>

        {/* ── Hero stat ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-6"
        >
          <p
            className="font-display font-black text-ink-primary leading-none"
            style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}
          >
            {data.totalHoursThisWeek}
          </p>
          <p className="text-sm font-mono text-ink-muted uppercase tracking-widest mt-2">
            hrs this week
          </p>
        </motion.div>

        {/* ── Daily average ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-center justify-center gap-2 mb-16"
        >
          <Clock size={16} className="text-ink-muted" />
          <p className="text-lg text-ink-secondary">
            Daily average:{" "}
            <span className="font-bold text-ink-primary">{data.dailyAverage}</span>
          </p>
        </motion.div>

        {/* ── Language breakdown ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Code2 size={20} className="text-ink-muted" />
            <p className="text-lg font-bold text-ink-primary">Languages</p>
          </div>

          <div className="space-y-6">
            {data.topLanguages.slice(0, 5).map((lang, i) => (
              <div key={lang.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: lang.color }}
                    />
                    <p className="text-sm font-bold text-ink-primary">
                      {lang.name}
                    </p>
                  </div>
                  <p className="text-sm font-mono text-ink-secondary">
                    {lang.percent}%
                  </p>
                </div>
                <div className="h-4 bg-bg-elevated rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: lang.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.percent}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.2,
                      delay: 0.2 + i * 0.12,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Top projects ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Folder size={20} className="text-ink-muted" />
            <p className="text-lg font-bold text-ink-primary">Top Projects</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.topProjects.slice(0, 3).map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="
                  rounded-2.5xl bg-bg-surface border border-border p-6
                  hover:border-border-hover hover:shadow-card-hover
                  transition-all duration-300
                "
              >
                <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-2">
                  Project
                </p>
                <p className="text-lg font-bold text-ink-primary mb-1">
                  {project.name}
                </p>
                <p className="font-display font-black text-2xl text-ink-primary">
                  {project.hours}
                  <span className="text-sm font-normal text-ink-secondary ml-1">
                    hrs
                  </span>
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Last updated ───────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono text-ink-muted text-center"
        >
          Last updated: {new Date(data.lastUpdated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </motion.p>
      </div>
    </section>
  );
}
