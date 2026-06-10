"use client";
// ============================================================
//  hooks/useAchievements.ts
//  Tracks visitor behaviour and fires "Achievement Unlocked"
//  toasts. Uses localStorage so achievements persist across
//  sessions and are only awarded once (unless reset).
// ============================================================
import { useState, useEffect, useCallback, useRef } from "react";
import type { Achievement, AchievementId } from "@/types";

// ─── Achievement Catalogue ────────────────────────────────────
const ACHIEVEMENTS_CATALOG: Record<AchievementId, Omit<Achievement, "unlocked" | "unlockedAt">> = {
  night_owl: {
    id:          "night_owl",
    title:       "🦉 The Night Owl",
    description: "Visited between midnight and 5 AM. We code at ungodly hours.",
    icon:        "🦉",
  },
  recruiter: {
    id:          "recruiter",
    title:       "💼 The Recruiter",
    description: "Downloaded my CV. Bold move — let's build something.",
    icon:        "💼",
  },
  explorer: {
    id:          "explorer",
    title:       "🗺️ The Explorer",
    description: "Discovered 3+ states on my travel map. Wanderlust detected.",
    icon:        "🗺️",
  },
  hacker: {
    id:          "hacker",
    title:       "💻 The Hacker",
    description: "Used the secret terminal command. You know your way around.",
    icon:        "💻",
  },
  bookworm: {
    id:          "bookworm",
    title:       "📚 The Bookworm",
    description: "Spent time in the bookshelf. A person of culture.",
    icon:        "📚",
  },
  first_visit: {
    id:          "first_visit",
    title:       "👋 First Contact",
    description: "Welcome. This was built with ☕ and questionable sleep.",
    icon:        "👋",
  },
};

const LS_KEY = "portfolio_achievements";

// ─── Hook ─────────────────────────────────────────────────────
export function useAchievements() {
  // Queue of toasts waiting to be displayed (one at a time)
  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<AchievementId>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Load previously unlocked achievements from localStorage ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved: AchievementId[] = JSON.parse(raw);
        setUnlockedIds(new Set(saved));
      }
    } catch { /* no-op — localStorage may be unavailable in SSR */ }
  }, []);

  // ── Process toast queue one-at-a-time ────────────────────────
  useEffect(() => {
    if (activeToast || toastQueue.length === 0) return;

    // Pop the first item and display it
    const [next, ...rest] = toastQueue;
    setToastQueue(rest);
    setActiveToast(next);

    // Auto-dismiss after 5 s
    timerRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 5_000);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [toastQueue, activeToast]);

  // ── Core unlock function ──────────────────────────────────────
  const unlock = useCallback((id: AchievementId) => {
    // Check if already unlocked — achievements fire only once
    setUnlockedIds((prev) => {
      if (prev.has(id)) return prev;                // already got it

      const catalog = ACHIEVEMENTS_CATALOG[id];
      const achievement: Achievement = {
        ...catalog,
        unlocked:   true,
        unlockedAt: new Date().toISOString(),
      };

      // Enqueue the toast
      setToastQueue((q) => [...q, achievement]);

      // Persist to localStorage
      const next = new Set(prev).add(id);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify([...next]));
      } catch { /* no-op */ }

      return next;
    });
  }, []);

  // ── Named convenience triggers ───────────────────────────────
  const triggerNightOwl  = useCallback(() => unlock("night_owl"),  [unlock]);
  const triggerRecruiter = useCallback(() => unlock("recruiter"),  [unlock]);
  const triggerExplorer  = useCallback(() => unlock("explorer"),   [unlock]);
  const triggerHacker    = useCallback(() => unlock("hacker"),     [unlock]);
  const triggerBookworm  = useCallback(() => unlock("bookworm"),   [unlock]);

  // ── Dismiss the current toast manually ───────────────────────
  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveToast(null);
  }, []);

  // ── Auto-check Night Owl on mount ────────────────────────────
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) triggerNightOwl();
  }, [triggerNightOwl]);

  // ── First visit ──────────────────────────────────────────────
  useEffect(() => {
    const alreadySeen = localStorage.getItem("portfolio_visited");
    if (!alreadySeen) {
      localStorage.setItem("portfolio_visited", "1");
      setTimeout(() => unlock("first_visit"), 2_000); // delay for page load
    }
  }, [unlock]);

  return {
    activeToast,
    unlockedIds,
    dismissToast,
    unlock,
    triggerNightOwl,
    triggerRecruiter,
    triggerExplorer,
    triggerHacker,
    triggerBookworm,
    isUnlocked: (id: AchievementId) => unlockedIds.has(id),
  };
}
