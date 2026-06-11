"use client";
// ============================================================
//  TravelSection.tsx — Full-screen India travel section
//  Wraps the existing IndiaMapCard with stats + memories timeline
// ============================================================
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Compass } from "lucide-react";
import { IndiaMapCard } from "@/components/travel/IndiaMap";
import travelData from "@/data/travel.json";
import type { TravelState } from "@/types";

const states = travelData as unknown as TravelState[];

// ─── Derived stats ───────────────────────────────────────────
const visitedOrLived = states.filter(
  (s) => s.status === "visited" || s.status === "lived"
);
const wishlistCount = states.filter((s) => s.status === "want").length;

// Flatten all memories for the timeline
const allMemories = states
  .filter((s) => s.status !== "want")
  .flatMap((s) =>
    s.memories.map((m) => ({
      stateName: s.stateName,
      emoji: s.emoji,
      year: m.year,
      highlight: m.highlight,
    }))
  )
  .sort((a, b) => {
    // Sort descending by year; "2019-2023" → take last segment
    const yearA = parseInt(a.year.split("-").pop() ?? "0", 10);
    const yearB = parseInt(b.year.split("-").pop() ?? "0", 10);
    return yearB - yearA;
  });

// ─── Animation variants ─────────────────────────────────────
const timelineContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const timelineItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Component ───────────────────────────────────────────────
export function TravelSection({
  onStateHover,
}: {
  onStateHover?: (id: string) => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.15 });

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
            (Travel)
          </p>
          <h2
            className="font-display font-black text-ink-primary leading-[0.95]"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
            }}
          >
            India Travels
          </h2>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <MapPin size={16} className="text-accent-red" />
              <p className="text-3xl font-display font-black text-ink-primary">
                {visitedOrLived.length}
              </p>
            </div>
            <p className="text-xs font-mono text-ink-muted uppercase tracking-wider">
              States Explored
            </p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <Compass size={16} className="text-accent-blue" />
              <p className="text-3xl font-display font-black text-ink-primary">
                {wishlistCount}
              </p>
            </div>
            <p className="text-xs font-mono text-ink-muted uppercase tracking-wider">
              On Wishlist
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── India Map Card — large display ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="min-h-[600px] lg:min-h-[700px] mb-20"
      >
        <IndiaMapCard onStateHover={onStateHover} />
      </motion.div>

      {/* ── Travel Memories Timeline ─────────────────────────── */}
      <div ref={timelineRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={timelineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2 flex items-center gap-2">
            <MapPin size={14} className="text-accent-red" />
            Travel Memories
          </p>
          <p className="text-sm text-ink-secondary max-w-lg">
            Moments from across the country that shaped who I am.
          </p>
        </motion.div>

        <motion.div
          variants={timelineContainerVariants}
          initial="hidden"
          animate={timelineInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Vertical line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-6">
            {allMemories.map((memory, i) => (
              <motion.div
                key={`${memory.stateName}-${i}`}
                variants={timelineItemVariants}
                className="relative pl-12 md:pl-16 group"
              >
                {/* Timeline dot */}
                <div
                  className="
                    absolute left-[10px] md:left-[18px] top-2
                    w-3 h-3 rounded-full
                    bg-accent-red/60 border-2 border-bg-primary
                    group-hover:bg-accent-red group-hover:scale-125
                    transition-all duration-200
                  "
                />

                {/* Memory card */}
                <div
                  className="
                    rounded-2.5xl bg-bg-surface border border-border
                    p-5 transition-all duration-300
                    hover:border-border-hover hover:shadow-card-hover
                  "
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{memory.emoji}</span>
                    <h4 className="text-sm font-bold text-ink-primary">
                      {memory.stateName}
                    </h4>
                    <span className="text-[10px] font-mono text-ink-muted ml-auto">
                      {memory.year}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {memory.highlight}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
