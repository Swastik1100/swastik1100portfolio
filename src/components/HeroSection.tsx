"use client";
// ============================================================
//  components/sections/HeroSection.tsx
//  NAKULA-inspired hero with scroll-driven reveals:
//  - On load: only "Swastik" is visible
//  - Scroll down: surname, photo, tagline, and bar fade in
// ============================================================
import { useRef }              from "react";
import Image                   from "next/image";
import Link                    from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown }           from "lucide-react";

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax drift across the full hero scroll
  const nameY  = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["8%", "18%"]);

  // Staggered scroll reveals (0 → 1 over ~180vh)
  const surnameOpacity = useTransform(scrollYProgress, [0.06, 0.20], [0, 1]);
  const surnameY       = useTransform(scrollYProgress, [0.06, 0.20], [28, 0]);

  const photoOpacity = useTransform(scrollYProgress, [0.18, 0.38], [0, 1]);
  const photoScale   = useTransform(scrollYProgress, [0.18, 0.38], [0.92, 1]);

  const taglineOpacity = useTransform(scrollYProgress, [0.36, 0.56], [0, 1]);
  const taglineX       = useTransform(scrollYProgress, [0.36, 0.56], [48, 0]);
  const taglineBlur    = useTransform(scrollYProgress, [0.36, 0.56], [6, 0]);
  const taglineFilter  = useTransform(taglineBlur, (v) => `blur(${v}px)`);

  const bottomOpacity = useTransform(scrollYProgress, [0.54, 0.74], [0, 1]);
  const bottomY       = useTransform(scrollYProgress, [0.54, 0.74], [24, 0]);

  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[185vh] bg-bg-primary"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* ── Subtle grid background ─────────────────────────── */}
        <div
          className="
            absolute inset-0 opacity-[0.03]
            bg-grid-dark bg-grid
            pointer-events-none
          "
        />

        {/* ── Main content ───────────────────────────────────── */}
        <div className="relative flex-1 flex flex-col">

          {/* Row: HUGE name + portrait + tagline */}
          <div className="relative flex-1 flex items-end pb-8 px-6 lg:px-10">

            {/* ── Big NAME (bottom-left) ──────────────────────── */}
            <motion.h1
              style={{ y: nameY }}
              className="
                absolute bottom-0 left-0
                text-display-2xl font-display font-black
                text-ink-primary leading-none
                pl-6 lg:pl-10 pb-16
                z-10 select-none
              "
            >
              Swastik
              <motion.span
                style={{ opacity: surnameOpacity, y: surnameY, display: "block" }}
                className="will-change-transform"
              >
                Pandey
              </motion.span>
            </motion.h1>

            {/* ── Portrait photo (centre stage) ──────────────── */}
            <motion.div
              style={{
                y: photoY,
                opacity: photoOpacity,
                scale: photoScale,
              }}
              className="
                absolute inset-x-0 bottom-0
                flex justify-center items-end
                pointer-events-none
              "
            >
              <div
                className="
                  relative w-[38vw] max-w-[520px] min-w-[260px]
                  aspect-[3/4] overflow-hidden
                "
              >
                <Image
                  src="/hero-photo.jpg"
                  alt="Swastik Pandey — Developer & Builder"
                  fill
                  className="object-cover object-top"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
                <div
                  className="
                    absolute inset-x-0 bottom-0 h-2/5
                    bg-gradient-to-t from-bg-primary to-transparent
                  "
                />
              </div>
            </motion.div>

            {/* ── Tagline (right side) ────────────────────────── */}
            <motion.div
              style={{
                opacity: taglineOpacity,
                x: taglineX,
                filter: taglineFilter,
              }}
              className="
                absolute bottom-0 right-0
                pr-6 lg:pr-10 pb-20
                text-right z-10
                will-change-transform
              "
            >
              <p
                className="
                  font-display font-black leading-none
                  text-ink-secondary
                "
                style={{ fontSize: "clamp(24px, 3.5vw, 52px)" }}
              >
                IT undergrad @NIT-Jalandhar<br />
                <span className="text-ink-primary">currently aiming to build</span><br />
                some really useful projects!
              </p>
            </motion.div>
          </div>

          {/* ── Bottom bar: descriptor + CTA ───────────────────── */}
          <motion.div
            style={{ opacity: bottomOpacity, y: bottomY }}
            className="
              relative z-10 border-t border-border
              px-6 lg:px-10 py-5
              flex flex-col sm:flex-row items-start sm:items-center
              justify-between gap-4
              will-change-transform
            "
          >
            <p className="text-sm text-ink-secondary font-mono max-w-sm">
              Turning messy random ideas into working websites,software. It’s not tough at all, just need alot of tokens.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="#work"
                className="
                  inline-flex items-center gap-2
                  px-6 py-3 rounded-full
                  bg-accent-red text-white
                  text-sm font-bold tracking-wide
                  hover:bg-accent-red/90
                  transition-colors
                "
              >
                VIEW WORK
              </Link>
              <a
                href="/cv.pdf"
                download
                className="
                  inline-flex items-center gap-2
                  text-sm font-mono text-ink-secondary
                  hover:text-ink-primary transition-colors
                "
              >
                ↓ Resume
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── Scroll indicator ─────────────────────────────────── */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="
            absolute bottom-6 left-1/2 -translate-x-1/2
            flex flex-col items-center gap-1
            text-ink-muted text-xs font-mono
            pointer-events-none
          "
        >
          <span>scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowDown size={14} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
