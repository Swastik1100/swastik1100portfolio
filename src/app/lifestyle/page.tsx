"use client";
// ============================================================
//  app/lifestyle/page.tsx  —  "Beyond Code" immersive page
//  Full-screen sections: Spotify → Fitness → Travel → Coding
//  → Bookshelf → Gaming → Dishes → Terminal → /Now
// ============================================================
import { useCallback }         from "react";
import Link                    from "next/link";
import { motion }              from "framer-motion";
import { ArrowLeft }           from "lucide-react";
import { Navbar }              from "@/components/layout/Navigation";
import { SpotifySection }      from "@/components/lifestyle/SpotifySection";
import { FitnessSection }      from "@/components/lifestyle/FitnessSection";
import { TravelSection }       from "@/components/lifestyle/TravelSection";
import { CodingSection }       from "@/components/lifestyle/CodingSection";
import { BookshelfSection }    from "@/components/lifestyle/BookshelfSection";
import { GamingSection }       from "@/components/lifestyle/GamingSection";
import { DishesSection }       from "@/components/lifestyle/DishesSection";
import { TerminalSection }     from "@/components/lifestyle/TerminalSection";
import { NowSection }          from "@/components/lifestyle/NowSection";
import { AchievementToast }    from "@/components/achievements/AchievementToast";
import { useAchievements }     from "@/hooks/useAchievements";

export default function LifestylePage() {
  const {
    activeToast,
    dismissToast,
    triggerExplorer,
    triggerHacker,
  } = useAchievements();

  const handleMapStateHover = useCallback(
    (_stateId: string) => { triggerExplorer(); },
    [triggerExplorer]
  );

  const handleTerminalSecret = useCallback(() => {
    triggerHacker();
  }, [triggerHacker]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-bg-primary">
        {/* ── Page Hero ─────────────────────────────────────── */}
        <section className="relative min-h-[60vh] flex flex-col justify-end px-6 lg:px-10 pb-16 pt-28 overflow-hidden">
          {/* Background decorative text */}
          <span
            className="
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              font-display font-black leading-none
              text-ink-primary/[0.02] select-none
              pointer-events-none whitespace-nowrap
            "
            style={{ fontSize: "clamp(150px, 20vw, 350px)" }}
          >
            BEYOND
          </span>

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mb-10"
          >
            <Link
              href="/"
              className="
                inline-flex items-center gap-2
                text-xs font-mono text-ink-muted
                hover:text-ink-primary transition-colors
              "
            >
              <ArrowLeft size={14} />
              Back to home
            </Link>
          </motion.div>

          {/* Title */}
          <div className="relative z-10 max-w-[1400px] mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-3">
                (Lifestyle Hub)
              </p>
              <h1
                className="font-display font-black text-ink-primary leading-none mb-6"
                style={{ fontSize: "clamp(48px, 8vw, 120px)" }}
              >
                Beyond Code
              </h1>
              <p className="text-base sm:text-lg text-ink-secondary max-w-2xl leading-relaxed">
                The things that keep me sharp outside the terminal — fitness PRs,
                travel stories, what I&apos;m reading, listening to, cooking, and building next.
              </p>
            </motion.div>
          </div>

          {/* Subtle bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
        </section>

        {/* ── Full-screen sections ──────────────────────────── */}
        <SpotifySection />
        <FitnessSection />
        <TravelSection onStateHover={handleMapStateHover} />
        <CodingSection />
        <BookshelfSection />
        <GamingSection />
        <DishesSection />
        <TerminalSection onSecretCode={handleTerminalSecret} />
        <NowSection />
      </main>

      {/* ── Achievement toast overlay ───────────────────────── */}
      <AchievementToast
        achievement={activeToast}
        onDismiss={dismissToast}
      />
    </>
  );
}
