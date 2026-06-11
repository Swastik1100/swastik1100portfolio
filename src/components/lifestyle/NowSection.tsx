"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

interface NowItem {
  emoji: string;
  category: string;
  title: string;
  description: string;
  progress?: number;
  progressLabel?: string;
}

const nowItems: NowItem[] = [
  {
    emoji: "🔨",
    category: "Building",
    title: '"Velox" real-time chat',
    description:
      "A blazing-fast chat app built with Next.js, WebSockets, and Redis pub/sub. Focusing on sub-50ms message delivery and end-to-end encryption.",
  },
  {
    emoji: "📖",
    category: "Reading",
    title: "Deep Work",
    description:
      "Cal Newport's guide to focused success in a distracted world. Applying the shutdown ritual and time-blocking techniques daily.",
    progress: 65,
    progressLabel: "65% complete",
  },
  {
    emoji: "🏋️",
    category: "Training",
    title: "150kg deadlift goal",
    description:
      "Currently pulling 130kg. Running a 5/3/1 programme with accessories. Targeting the milestone by end of summer.",
    progress: 87,
    progressLabel: "130 / 150 kg",
  },
  {
    emoji: "🗺️",
    category: "Planning",
    title: "Spiti Valley trip",
    description:
      "Mapping out a 10-day road trip through Spiti — Chitkul, Kalpa, Kaza, Chandratal. Permits, gear, and itinerary in progress.",
  },
  {
    emoji: "🎮",
    category: "Playing",
    title: "Baldur's Gate 3",
    description:
      "Act 3, 120+ hours deep. Playing a Dark Urge Paladin/Warlock multiclass. Every long rest feels earned.",
  },
];

function ProgressBar({
  progress,
  label,
}: {
  progress: number;
  label: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(barRef, { once: true });

  return (
    <div ref={barRef} className="mt-3 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-ink-muted">{label}</span>
        <span className="text-xs font-mono text-accent-green font-semibold">
          {progress}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-blue"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${progress}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function NowCard({ item, index }: { item: NowItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="rounded-2.5xl bg-bg-surface border border-border p-6 lg:p-8
                 transition-all duration-300 hover:border-border-hover hover:shadow-card-hover"
    >
      <div className="flex items-start gap-4">
        {/* Emoji */}
        <span className="text-3xl flex-shrink-0 mt-0.5">{item.emoji}</span>

        <div className="flex-1 min-w-0">
          {/* Category */}
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-1">
            {item.category}
          </p>

          {/* Title */}
          <h3 className="text-xl font-bold text-ink-primary leading-tight mb-2">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-ink-secondary leading-relaxed">
            {item.description}
          </p>

          {/* Progress bar */}
          {item.progress !== undefined && item.progressLabel && (
            <ProgressBar
              progress={item.progress}
              label={item.progressLabel}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function NowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 px-6 lg:px-16"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">
            (/now)
          </p>
          <h2
            className="font-display font-black text-ink-primary leading-[0.95] mb-3"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
            }}
          >
            Right Now
          </h2>
          <p className="text-lg text-ink-secondary">June 2024</p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-5">
          {nowItems.map((item, i) => (
            <NowCard key={item.category} item={item} index={i} />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-ink-muted">
            <Clock size={14} />
            <span className="text-xs font-mono">Last updated: June 2024</span>
          </div>

          <a
            href="/now"
            className="group inline-flex items-center gap-2 text-sm font-mono text-accent-blue
                       hover:text-accent-blue/80 transition-colors"
          >
            full /now page
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
