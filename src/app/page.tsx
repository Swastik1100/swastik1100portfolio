"use client";
// ============================================================
//  app/page.tsx  —  Home page
//  Composes: Hero → About → Work → Lifestyle teaser
//  The full "Beyond Code" section lives at /lifestyle
// ============================================================
import Link                   from "next/link";
import { motion }             from "framer-motion";
import { ArrowRight, Music2, Dumbbell, MapPin, Terminal } from "lucide-react";
import { Navbar }             from "@/components/layout/Navigation";
import { HeroSection }        from "@/components/HeroSection";
import { AboutSection }       from "@/components/AboutSection";
import { WorkSection }        from "@/components/WorkSection";
import { AchievementToast }   from "@/components/achievements/AchievementToast";
import { useAchievements }    from "@/hooks/useAchievements";

// ─── Lifestyle Teaser Card ──────────────────────────────────
function LifestyleTeaser() {
  const pills = [
    { icon: Music2,   label: "Spotify",   color: "text-accent-green" },
    { icon: Dumbbell, label: "Gym PRs",   color: "text-accent-red" },
    { icon: MapPin,   label: "Travel",    color: "text-accent-amber" },
    { icon: Terminal, label: "Terminal",   color: "text-accent-blue" },
  ];

  return (
    <section id="lifestyle" className="relative bg-bg-primary px-6 lg:px-10 py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto">
        <Link href="/lifestyle" className="group block">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="
              relative overflow-hidden rounded-3xl
              border border-border
              bg-bg-surface
              p-8 sm:p-10 lg:p-14
              hover:border-border-hover hover:shadow-card-hover
              transition-all duration-500
            "
          >
            {/* Background decorative text */}
            <span
              className="
                absolute -bottom-6 -right-4
                font-display font-black leading-none
                text-ink-primary/[0.03] select-none
                pointer-events-none
              "
              style={{ fontSize: "clamp(100px, 15vw, 220px)" }}
            >
              LIFE
            </span>

            <div className="relative z-10">
              {/* Label */}
              <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-3">
                (Lifestyle)
              </p>

              {/* Title */}
              <h2
                className="font-display font-black text-ink-primary leading-none mb-4"
                style={{ fontSize: "clamp(32px, 4.5vw, 64px)" }}
              >
                Beyond Code
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-ink-secondary max-w-lg leading-relaxed mb-8">
                Spotify now playing, gym PRs, India travel map, coding stats,
                bookshelf, games &amp; an interactive terminal — all in one place.
              </p>

              {/* Category pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {pills.map(({ icon: Icon, label, color }) => (
                  <span
                    key={label}
                    className="
                      inline-flex items-center gap-2
                      text-xs font-mono
                      px-3 py-1.5 rounded-full
                      border border-border
                      bg-bg-elevated/50
                      text-ink-secondary
                      group-hover:border-border-hover
                      transition-colors duration-300
                    "
                  >
                    <Icon size={13} className={color} />
                    {label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <span
                className="
                  inline-flex items-center gap-2
                  text-sm font-bold text-ink-primary
                  group-hover:text-accent-red
                  transition-colors duration-300
                "
              >
                Explore the full hub
                <ArrowRight
                  size={16}
                  className="
                    transition-transform duration-300
                    group-hover:translate-x-1
                  "
                />
              </span>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}

// ─── Home Page ───────────────────────────────────────────────
export default function HomePage() {
  const { activeToast, dismissToast } = useAchievements();

  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <LifestyleTeaser />
      </main>

      <AchievementToast
        achievement={activeToast}
        onDismiss={dismissToast}
      />
    </>
  );
}
