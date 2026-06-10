"use client";
// ============================================================
//  components/ui/AchievementToast.tsx
//  8-bit inspired achievement popup with Framer Motion animations.
//  Drops in from the top-right corner, auto-dismisses in 5s.
// ============================================================
import { AnimatePresence, motion } from "framer-motion";
import type { Achievement }         from "@/types";

interface Props {
  achievement: Achievement | null;
  onDismiss:   () => void;
}

export function AchievementToast({ achievement, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          // ── Entrance/exit ───────────────────────────────────
          initial={{ opacity: 0, y: -80, scale: 0.9 }}
          animate={{ opacity: 1, y:   0, scale: 1.0 }}
          exit={{    opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}

          // ── Layout: fixed top-right on all screens ──────────
          className="
            fixed top-6 right-6 z-[9999]
            max-w-[340px] w-full
            cursor-pointer select-none
          "
          onClick={onDismiss}
          role="alert"
          aria-live="polite"
        >
          {/* ── Outer card with accent border glow ─────────── */}
          <div
            className="
              relative overflow-hidden rounded-2xl
              bg-[#111111] border border-accent-amber/30
              shadow-[0_0_40px_rgba(245,158,11,0.15)]
              p-4
            "
          >
            {/* 8-bit scanline effect overlay */}
            <div
              className="
                absolute inset-0 pointer-events-none
                bg-[repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.15) 2px,
                  rgba(0,0,0,0.15) 4px
                )]
              "
            />

            {/* Auto-dismiss progress bar */}
            <motion.div
              className="absolute top-0 left-0 h-[2px] bg-accent-amber"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
            />

            {/* ── Content ─────────────────────────────────── */}
            <div className="relative flex items-start gap-3">
              {/* Icon badge */}
              <div
                className="
                  flex-shrink-0 w-12 h-12 rounded-xl
                  bg-accent-amber/10 border border-accent-amber/20
                  flex items-center justify-center text-2xl
                "
              >
                {achievement.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                {/* Label */}
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-amber mb-0.5">
                  ⚡ Achievement Unlocked
                </p>
                {/* Title */}
                <p className="text-sm font-bold text-ink-primary leading-tight">
                  {achievement.title}
                </p>
                {/* Description */}
                <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                  {achievement.description}
                </p>
              </div>

              {/* Dismiss X */}
              <button
                onClick={onDismiss}
                className="
                  flex-shrink-0 text-ink-muted hover:text-ink-primary
                  transition-colors text-lg leading-none -mt-0.5
                "
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
